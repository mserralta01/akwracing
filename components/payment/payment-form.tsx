"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Course } from "@/types/course";
import { Enrollment, ParentProfile, PaymentDetails } from "@/types/student";
import { paymentService } from "@/lib/services/payment-service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const paymentFormSchema = z.object({
  cardNumber: z.string().min(15).max(16),
  expiryMonth: z.string().min(2).max(2),
  expiryYear: z.string().min(2).max(2),
  cvv: z.string().min(3).max(4),
  sameAsParent: z.boolean().default(true),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(5, "Valid ZIP code is required"),
  }),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  course: Course;
  enrollment: Enrollment;
  parent: ParentProfile;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

type PaymentNotificationState = {
  status: "success" | "error" | "pending" | null;
  message: string;
  details?: string;
};

const formatCreditCard = (value: string) => {
  if (!value) return value;
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  }
  return value;
};

const getPaymentErrorMessage = (error: string): { message: string; details?: string } => {
  const errorMessages: Record<string, { message: string; details?: string }> = {
    "card_declined": {
      message: "Your card was declined.",
      details: "Please check your card details or try a different card."
    },
    "insufficient_funds": {
      message: "Insufficient funds.",
      details: "Please ensure your card has sufficient funds or try a different card."
    },
    "invalid_card": {
      message: "Invalid card information.",
      details: "Please check your card details and try again."
    },
    "expired_card": {
      message: "Your card has expired.",
      details: "Please use a different card."
    },
    "invalid_expiry": {
      message: "Invalid expiration date.",
      details: "Please check the expiration date and try again."
    },
    "invalid_cvv": {
      message: "Invalid security code (CVV).",
      details: "Please check the CVV and try again."
    }
  };

  for (const [key, value] of Object.entries(errorMessages)) {
    if (error.toLowerCase().includes(key)) {
      return value;
    }
  }

  return {
    message: "We couldn't process your payment.",
    details: "Please try again or contact support if the problem persists."
  };
};

export function PaymentForm({
  course,
  enrollment,
  parent,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{ message: string; details?: string } | null>(null);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      sameAsParent: true,
      firstName: parent.firstName,
      lastName: parent.lastName,
      address: {
        street: parent.address.street,
        city: parent.address.city,
        state: parent.address.state,
        zipCode: parent.address.zipCode,
      },
    },
  });

  const sameAsParent = form.watch("sameAsParent");

  useEffect(() => {
    if (sameAsParent) {
      form.setValue("firstName", parent.firstName);
      form.setValue("lastName", parent.lastName);
      form.setValue("address.street", parent.address.street);
      form.setValue("address.city", parent.address.city);
      form.setValue("address.state", parent.address.state);
      form.setValue("address.zipCode", parent.address.zipCode);
    }
  }, [sameAsParent, parent, form]);

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    try {
      setIsProcessing(true);

      const paymentDetails: PaymentDetails = {
        cardNumber: data.cardNumber,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        cvv: data.cvv,
        firstName: data.firstName,
        lastName: data.lastName,
        address: {
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.zipCode,
        },
      };

      const result = await paymentService.processPayment(enrollment, course, paymentDetails);

      if (result.success && result.transactionId) {
        onSuccess(result.transactionId);
      } else {
        const errorInfo = getPaymentErrorMessage(result.error || "Payment processing failed");
        setErrorDetails(errorInfo);
        setShowErrorDialog(true);
        onError(result.error || "Payment processing failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Payment processing failed";
      const errorInfo = getPaymentErrorMessage(errorMessage);
      setErrorDetails(errorInfo);
      setShowErrorDialog(true);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Payment Failed</DialogTitle>
            <DialogDescription>
              <div className="space-y-4">
                <p className="font-medium">{errorDetails?.message}</p>
                {errorDetails?.details && (
                  <p className="text-sm text-muted-foreground">{errorDetails.details}</p>
                )}
                <Button 
                  onClick={() => setShowErrorDialog(false)}
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePaymentSubmit)} className="space-y-6">
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Payment Details</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                Secure Payment
              </div>
            </div>

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        {...field}
                        value={formatCreditCard(field.value)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                          if (value.length <= 16) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0");
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="YY" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i)
                              .toString()
                              .slice(-2);
                            return (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          {...field}
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              field.onChange(value);
                            }
                          }}
                          type="password"
                          maxLength={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Billing Information</h3>
              </div>
              <FormField
                control={form.control}
                name="sameAsParent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Same as Parent
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={sameAsParent} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={sameAsParent} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={sameAsParent} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={sameAsParent} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={sameAsParent} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={sameAsParent} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span>{course.price}</span>
            </div>

            <Button
              type="submit"
              className="w-full bg-racing-red hover:bg-racing-red/90"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner"></span>
                  Processing...
                </div>
              ) : (
                `Complete Payment - ${course.price}`
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
} 