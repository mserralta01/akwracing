"use client";

import { useState } from "react";
import { Course } from "@/types/course";
import { Enrollment, StudentProfile, ParentProfile } from "@/types/student";
import { StudentForm } from "@/components/enrollment/student-form";
import { ParentForm } from "@/components/enrollment/parent-form";
import { PaymentForm } from "@/components/payment/payment-form";
import { studentService } from "@/lib/services/student-service";
import { emailService } from "@/lib/services/email-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Check, CreditCard, User, Users } from "lucide-react";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

type EnrollmentStep = "student" | "parent" | "payment" | "confirmation";

interface EnrollmentFlowProps {
  course: Course;
  onComplete: () => void;
}

const steps = [
  { id: "student", label: "Student", icon: User },
  { id: "parent", label: "Parent", icon: Users },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirmation", label: "Complete", icon: Check },
] as const;

export function EnrollmentFlow({ course, onComplete }: EnrollmentFlowProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<EnrollmentStep>("student");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStudentSubmit = async (studentData: Omit<StudentProfile, "id" | "createdAt" | "updatedAt" | "parentId">) => {
    try {
      setLoading(true);
      
      // Ensure we have a valid UUID for the parent
      const tempParentId = crypto.randomUUID();
      
      // Create the initial parent document with minimal required data
      const tempParentRef = doc(db, 'parents', tempParentId);
      const now = Timestamp.now();
      
      await setDoc(tempParentRef, {
        id: tempParentId,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        students: [],
        createdAt: now,
        updatedAt: now,
      });

      // Create student with proper parent reference
      const createdStudent = await studentService.createStudent({
        ...studentData,
        parentId: tempParentId,
      });
      
      setStudent(createdStudent);
      setCurrentStep("parent");
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

  const handleParentSubmit = async (parentData: Omit<ParentProfile, "id" | "createdAt" | "updatedAt" | "userId" | "students">) => {
    try {
      setLoading(true);
      if (!student) throw new Error("No student data found");

      // Update the existing parent document instead of creating a new one
      const updatedParent = await studentService.updateParentProfile(student.parentId, {
        ...parentData,
        students: [student.id],
      });
      
      setParent(updatedParent);

      // Create enrollment record
      const enrollmentData = {
        courseId: course.id,
        studentId: student.id,
        parentId: student.parentId,
        status: "pending_payment" as const,
        paymentDetails: {
          amount: course.price,
          currency: "USD",
          paymentStatus: "pending" as const,
        },
      };

      const createdEnrollment = await studentService.createEnrollment(enrollmentData);
      setEnrollment(createdEnrollment);
      setCurrentStep("payment");
    } catch (error) {
      console.error("Error creating parent:", error);
      toast({
        title: "Error",
        description: "Failed to create parent profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      setLoading(true);
      if (!enrollment || !student || !parent) return;

      // Update enrollment status
      await studentService.updateEnrollment(enrollment.id, {
        status: "confirmed",
        paymentDetails: {
          ...enrollment.paymentDetails,
          paymentStatus: "completed",
          transactionId,
        },
      });

      // Send confirmation emails
      await Promise.all([
        emailService.sendEnrollmentConfirmation(enrollment, course, student, parent),
        emailService.sendPaymentConfirmation(enrollment, course, parent),
      ]);

      setCurrentStep("confirmation");
    } catch (error) {
      console.error("Error processing payment success:", error);
      toast({
        title: "Error",
        description: "Failed to complete enrollment",
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">
            {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
          </p>
          
          <div className="flex justify-between items-center mt-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  {index > 0 && (
                    <div 
                      className={cn(
                        "h-[2px] w-16 -mx-2",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                  <div 
                    className={cn(
                      "flex flex-col items-center gap-2 relative",
                      isActive ? "text-primary" : isCompleted ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2",
                        isActive ? "border-primary bg-primary/10" : 
                        isCompleted ? "border-primary bg-primary text-white" : 
                        "border-muted bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {currentStep === "student" && (
            <StudentForm
              onSubmit={handleStudentSubmit}
              loading={loading}
              course={course}
            />
          )}
          {currentStep === "parent" && (
            <ParentForm
              onSubmit={handleParentSubmit}
              loading={loading}
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
          {currentStep === "confirmation" && (
            <div className="text-center py-8">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Enrollment Complete!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for enrolling in {course.title}. You will receive a confirmation email shortly.
              </p>
              <Button onClick={onComplete}>Return to Courses</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 