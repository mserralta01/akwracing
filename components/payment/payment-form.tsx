"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Course } from "@/types/course";
import { StudentProfile, ParentProfile } from "@/types/student";
import { BaseEnrollment } from "@/types/enrollment";
import { PaymentToken } from "@/types/payment";
import { paymentService } from "@/lib/services/payment-service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, CreditCard, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const paymentFormSchema = z.object({
  cardNumber: z.string().min(15).max(16),
  expiryMonth: z.string()
    .min(1)
    .max(2)
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num <= 12;
    }, "Month must be between 1 and 12"),
  expiryYear: z.string().min(2).max(2),
  cvv: z.string().min(3).max(4),
  savePaymentMethod: z.boolean().default(false),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  course: Course;
  enrollment: BaseEnrollment;
  parent: ParentProfile;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

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

export function PaymentForm({
  course,
  enrollment,
  parent,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedCards, setSavedCards] = useState<PaymentToken[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const defaultValues = {
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    savePaymentMethod: false,
  };

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const loadSavedCards = async () => {
      try {
        const cards = await paymentService.getStoredPaymentMethods(parent.id);
        setSavedCards(cards);
      } catch (error) {
        console.error('Error loading saved cards:', error);
      }
    };
    loadSavedCards();
  }, [parent.id]);

  const handleSubmit = async (data: PaymentFormData) => {
    console.log("Form data in handleSubmit:", data);

    try {
      setIsProcessing(true);

      const paymentDetails = {
        cardNumber: data.cardNumber.replace(/\s/g, ''),
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        cvv: data.cvv,
        firstName: parent.firstName,
        lastName: parent.lastName,
        address: parent.address,
      };

      const options = {
        shouldTokenize: data.savePaymentMethod,
        customerId: parent.id,
        savePaymentMethod: data.savePaymentMethod,
      };

      const result = await paymentService.processPayment(
        enrollment,
        course,
        paymentDetails,
        options
      );

      if (result.success && result.transactionId) {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        onSuccess(result.transactionId);
      } else {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: result.error || "Payment processing failed. Please try again.",
        });
        onError(result.error || "Payment processing failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Payment processing failed";
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: errorMessage,
      });
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSavedCardPayment = async (tokenId: string) => {
    try {
      setIsProcessing(true);
      setSelectedCard(tokenId);

      const paymentDetails = {
        tokenId,
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        firstName: parent.firstName,
        lastName: parent.lastName,
        address: parent.address,
      };

      const result = await paymentService.processPayment(
        enrollment,
        course,
        paymentDetails,
        { customerId: parent.id }
      );

      if (result.success && result.transactionId) {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        onSuccess(result.transactionId);
      } else {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: result.error || "Payment processing failed. Please try again.",
        });
        onError(result.error || "Payment processing failed");
      }
    } catch (error) {
      console.error("Saved card payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Payment processing failed";
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: errorMessage,
      });
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
      setSelectedCard(null);
    }
  };

  return (
    <div className="space-y-6">
      {savedCards.length > 0 && (
        <Card className="p-4">
          <div className="space-y-4">
            {savedCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      •••• {card.card.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {card.card.exp_month}/{card.card.exp_year}
                      {card.card.brand && ` - ${card.card.brand}`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleSavedCardPayment(card.id)}
                  disabled={isProcessing}
                >
                  {isProcessing && selectedCard === card.id ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </motion.div>
                  ) : (
                    "Pay with this card"
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pl-10"
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
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
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
                  <FormControl>
                    <Input
                      placeholder="MM"
                      maxLength={2}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 2) {
                          const num = parseInt(value);
                          if (!value || (num > 0 && num <= 12)) {
                            field.onChange(value);
                          }
                        }
                      }}
                    />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      placeholder="YY"
                      maxLength={2}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 2) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
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
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="savePaymentMethod"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Save payment method for future use</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </motion.div>
              ) : (
                <span className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Pay ${course.price}</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Payments are secure and encrypted</span>
      </div>
    </div>
  );
}
