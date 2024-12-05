"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ParentProfile } from "@/types/student";
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

const parentFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(5, "Valid ZIP code is required"),
  }),
});

type ParentFormData = z.infer<typeof parentFormSchema>;

interface ParentFormProps {
  onSubmit: (data: Omit<ParentProfile, "id" | "createdAt" | "updatedAt" | "userId" | "students">) => void;
  loading?: boolean;
}

const formatPhoneNumber = (value: string) => {
  if (!value) return "+1 ";
  
  // Remove all non-digits and any leading "1" if it exists
  let phoneNumber = value.replace(/[^\d]/g, '');
  if (phoneNumber.startsWith('1')) {
    phoneNumber = phoneNumber.slice(1);
  }
  
  // Format the number
  if (phoneNumber.length === 0) return "+1 ";
  if (phoneNumber.length <= 3) return `+1 (${phoneNumber}`;
  if (phoneNumber.length <= 6) return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const unformatPhoneNumber = (value: string) => {
  const digits = value.replace(/[^\d]/g, '');
  return digits.startsWith('1') ? digits.slice(1) : digits;
};

// Add default values for parent form
const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "+1 ",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
  },
};

export function ParentForm({ onSubmit, loading }: ParentFormProps) {
  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentFormSchema),
    defaultValues,
  });

  const handleSubmit = (data: ParentFormData) => {
    // Remove formatting from phone number before submitting
    const formattedData = {
      ...data,
      phone: unformatPhoneNumber(data.phone),
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={formatPhoneNumber(field.value)}
                    onChange={(e) => {
                      const value = e.target.value;
                      const digits = value.replace(/[^\d]/g, '');
                      // Remove leading "1" if present and ensure max length of 10
                      const cleanDigits = digits.startsWith('1') ? digits.slice(1) : digits;
                      if (cleanDigits.length <= 10) {
                        field.onChange(cleanDigits);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace') {
                        const input = e.target as HTMLInputElement;
                        const selectionStart = input.selectionStart || 0;
                        const value = field.value;
                        
                        // Prevent backspace if cursor is at or before "+1 "
                        if (selectionStart <= 3) {
                          e.preventDefault();
                          return;
                        }
                        
                        // Remove last digit
                        field.onChange(value.slice(0, -1));
                        e.preventDefault();
                      }
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
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
                <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing...
            </div>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </Form>
  );
} 