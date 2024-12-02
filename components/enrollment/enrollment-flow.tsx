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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Check, CreditCard, User, Users } from "lucide-react";

type EnrollmentStep = "student" | "parent" | "payment" | "confirmation";

interface EnrollmentFlowProps {
  course: Course;
  onComplete: () => void;
}

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
      const tempParentId = crypto.randomUUID();
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
      const createdParent = await studentService.createParent({
        ...parentData,
        students: [student!.id],
      });
      setParent(createdParent);

      // Create enrollment record
      const enrollmentData = {
        courseId: course.id,
        studentId: student!.id,
        parentId: createdParent.id,
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
      if (!enrollment) return;

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
        emailService.sendEnrollmentConfirmation(enrollment, course, student!, parent!),
        emailService.sendPaymentConfirmation(enrollment, course, parent!),
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

  const renderStep = () => {
    switch (currentStep) {
      case "student":
        return (
          <StudentForm
            onSubmit={handleStudentSubmit}
            loading={loading}
          />
        );
      case "parent":
        return (
          <ParentForm
            onSubmit={handleParentSubmit}
            loading={loading}
          />
        );
      case "payment":
        if (!enrollment || !course) return null;
        return (
          <PaymentForm
            course={course}
            enrollment={enrollment}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        );
      case "confirmation":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Complete!</CardTitle>
              <CardDescription>
                Thank you for enrolling in {course.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span>Payment processed successfully</span>
              </div>
              <p>
                We've sent confirmation emails to {parent?.email}. Please check
                your inbox for further instructions.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={onComplete}>Done</Button>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <nav className="flex gap-4">
          <StepIndicator
            icon={User}
            label="Student"
            active={currentStep === "student"}
            completed={currentStep !== "student"}
          />
          <StepIndicator
            icon={Users}
            label="Parent"
            active={currentStep === "parent"}
            completed={currentStep === "payment" || currentStep === "confirmation"}
          />
          <StepIndicator
            icon={CreditCard}
            label="Payment"
            active={currentStep === "payment"}
            completed={currentStep === "confirmation"}
          />
          <StepIndicator
            icon={Check}
            label="Confirmation"
            active={currentStep === "confirmation"}
            completed={false}
          />
        </nav>
      </div>

      <div className="max-w-2xl mx-auto">{renderStep()}</div>
    </div>
  );
}

interface StepIndicatorProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  completed: boolean;
}

function StepIndicator({
  icon: Icon,
  label,
  active,
  completed,
}: StepIndicatorProps) {
  return (
    <div
      className={`flex flex-col items-center gap-2 ${
        active ? "text-primary" : completed ? "text-green-600" : "text-muted-foreground"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          active
            ? "bg-primary text-primary-foreground"
            : completed
            ? "bg-green-600 text-white"
            : "bg-muted"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
} 