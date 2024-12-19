"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { StudentProfile, ParentProfile } from "@/types/student";
import { BaseEnrollment } from "@/types/enrollment";
import { Payment } from "@/types/payment";
import { StudentForm } from "@/components/enrollment/student-form";
import { ParentForm } from "@/components/enrollment/parent-form";
import { PaymentForm } from "@/components/payment/payment-form";
import { studentService } from "@/lib/services/student-service";
import { emailService } from "@/lib/services/email-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Check, CreditCard, UserCircle, Users, ArrowRight, Mail } from "lucide-react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";

type EnrollmentStep = "auth" | "parent" | "payment" | "student" | "confirmation";

interface EnrollmentState {
  step: EnrollmentStep;
  enrollment: BaseEnrollment | null;
  parent: ParentProfile | null;
  student: StudentProfile | null;
}

const STORAGE_KEY = "enrollment_state";

const steps = [
  { id: "auth", label: "Sign In", icon: Mail },
  { id: "parent", label: "Parent", icon: Users },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "student", label: "Racer Info", icon: UserCircle },
  { id: "confirmation", label: "Complete", icon: Check },
] as const;

export function EnrollmentFlow({ course, onComplete }: { course: Course; onComplete: () => void }) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<EnrollmentStep>("auth");
  const [enrollment, setEnrollment] = useState<BaseEnrollment | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const state = JSON.parse(savedState) as EnrollmentState;
        setCurrentStep(state.step);
        setEnrollment(state.enrollment);
        setParent(state.parent);
        setStudent(state.student);
      } catch (error) {
        console.error("Error restoring enrollment state:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state: EnrollmentState = {
      step: currentStep,
      enrollment,
      parent,
      student,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [currentStep, enrollment, parent, student]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        checkExistingParent(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkExistingParent = async (user: FirebaseUser) => {
    try {
      const parentDoc = await getDoc(doc(db, "parents", user.uid));
      if (parentDoc.exists()) {
        const parentData = parentDoc.data() as ParentProfile;
        setParent(parentData);
        
        // If there's no enrollment yet, create one
        if (!enrollment) {
          const tempStudentId = crypto.randomUUID();
          const enrollmentData: Omit<
            BaseEnrollment,
            "id" | "createdAt" | "updatedAt"
          > = {
            courseId: course.id,
            studentId: tempStudentId,
            parentId: user.uid,
            status: "pending",
            paymentDetails: {
              amount: course.price,
              currency: "USD",
              paymentStatus: "pending",
            },
            notes: [],
            communicationHistory: [],
            payment: undefined,
            student: {} as StudentProfile,
            courseDetails: {} as Course,
          };

          const createdEnrollment = await studentService.createEnrollment(
            enrollmentData
          );
          setEnrollment(createdEnrollment);
        }
        
        setCurrentStep("payment");
      } else {
        setCurrentStep("parent");
      }
    } catch (error) {
      console.error("Error checking parent:", error);
      setCurrentStep("parent");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        toast({
          title: "Successfully signed in",
          description: "Welcome to AKW Racing Academy",
        });
        
        await checkExistingParent(result.user);
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    setCurrentStep("parent");
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      setLoading(true);
      if (!enrollment || !parent) return;

      const now = new Date().toISOString();
      const paymentId = crypto.randomUUID();

      const payment: Payment = {
        id: paymentId,
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        enrollmentId: enrollment.id,
        amount: enrollment.paymentDetails.amount,
        currency: enrollment.paymentDetails.currency,
        status: "completed",
        paymentMethod: {
          type: "card",
          last4: "****",
        },
        metadata: {
          courseId: course.id,
          courseName: course.title,
        },
        transactionId,
        createdAt: now,
        updatedAt: now,
      };

      await studentService.updateEnrollment(enrollment.id, {
        paymentDetails: {
          ...enrollment.paymentDetails,
          paymentStatus: "completed",
        },
        payment,
      });

      setCurrentStep("student");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  const handleParentSubmit = async (data: ParentProfile) => {
    try {
      setLoading(true);
      const parentId = user?.uid || crypto.randomUUID();

      const parent: ParentProfile = {
        ...data,
        id: parentId,
      };

      await setDoc(doc(db, "parents", parentId), parent);
      setParent(parent);

      const tempStudentId = crypto.randomUUID();
      const enrollmentData: Omit<
        BaseEnrollment,
        "id" | "createdAt" | "updatedAt"
      > = {
        courseId: course.id,
        studentId: tempStudentId,
        parentId: parentId,
        status: "pending",
        paymentDetails: {
          amount: course.price,
          currency: "USD",
          paymentStatus: "pending",
        },
        notes: [],
        communicationHistory: [],
        payment: undefined,
        student: {} as StudentProfile,
        courseDetails: {} as Course,
      };

      const createdEnrollment = await studentService.createEnrollment(
        enrollmentData
      );
      setEnrollment(createdEnrollment);

      setCurrentStep("payment");
    } catch (error) {
      console.error("Error creating parent:", error);
      toast({
        title: "Error",
        description: "Failed to create parent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (studentData: Omit<StudentProfile, "id" | "createdAt" | "updatedAt" | "parentId">) => {
    try {
      setLoading(true);
      if (!enrollment || !parent) return;

      const createdStudent = await studentService.createStudent({
        ...studentData,
        parentId: parent.id,
      });
      
      setStudent(createdStudent);

      await Promise.all([
        studentService.updateEnrollment(enrollment.id, {
          studentId: createdStudent.id,
          status: "confirmed",
        }),
        studentService.updateParentProfile(parent.id, {
          ...parent,
          students: [createdStudent.id],
        }),
      ]);

      await Promise.all([
        emailService.sendEnrollmentConfirmation(enrollment, course, createdStudent, parent),
        emailService.sendPaymentConfirmation(enrollment, course, parent),
      ]);

      // Clear saved state on completion
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep("confirmation");
    } catch (error) {
      console.error("Error creating student:", error);
      toast({
        title: "Error",
        description: "Failed to create student profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="max-w-[520px] mx-auto px-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
            
            return (
              <div key={step.id} className="flex items-center">
                {index > 0 && (
                  <div className="w-12 mx-1">
                    <ArrowRight 
                      className={cn(
                        "h-4 w-4",
                        isCompleted ? "text-primary" : "text-muted"
                      )}
                    />
                  </div>
                )}
                <div 
                  className={cn(
                    "flex flex-col items-center gap-1.5",
                    isActive ? "text-primary" : isCompleted ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                      isActive ? "border-primary bg-primary/10 scale-110" : 
                      isCompleted ? "border-primary bg-primary text-white" : 
                      "border-muted bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          {currentStep === "auth" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </div>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={continueAsGuest}
                  disabled={loading}
                >
                  Continue as Guest
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === "parent" && (
            <ParentForm
              onSubmit={handleParentSubmit}
              loading={loading}
              course={course}
              initialValues={
                user
                  ? {
                      firstName: user.displayName?.split(" ")[0] || "",
                      lastName:
                        user.displayName?.split(" ").slice(1).join(" ") || "",
                      email: user.email || "",
                      phone: "",
                      address: {
                        street: "",
                        city: "",
                        state: "",
                        zipCode: "",
                      },
                    }
                  : undefined
              }
            />
          )}

          {currentStep === "payment" && enrollment && parent && (
            <PaymentForm
              course={course}
              enrollment={enrollment}
              parent={parent}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
          
          {currentStep === "student" && (
            <StudentForm
              onSubmit={handleStudentSubmit}
              loading={loading}
              course={course}
            />
          )}
          
          {currentStep === "confirmation" && (
            <div className="py-8 px-4 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Enrollment Complete!</h3>
              <p className="text-muted-foreground">
                Thank you for enrolling in {course.title}. You will receive a confirmation email shortly.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  onComplete();
                }}
              >
                Close
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
