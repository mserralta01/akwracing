"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { bookingSchema } from "@/lib/validations/booking"
import { ChevronRight } from "lucide-react"
import type { z } from "zod"

type BookingFormValues = z.infer<typeof bookingSchema>

const defaultValues: Partial<BookingFormValues> = {
  name: "",
  email: "",
  phone: "",
  program: "",
  date: undefined,
}

const programs = [
  { id: "beginner", name: "Beginner Course", price: "$499" },
  { id: "advanced", name: "Advanced Training", price: "$899" },
  { id: "race-ready", name: "Race Ready", price: "$1,299" },
]

export function BookingForm() {
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[600px] bg-gray-900 rounded-lg animate-pulse" />
  }

  function onSubmit(data: BookingFormValues) {
    if (step < 3) {
      setStep(step + 1)
    } else {
      console.log(data)
      // Handle form submission
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex items-center ${i < 3 ? "flex-1" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i <= step ? "bg-red-600" : "bg-gray-700"
              }`}
            >
              <span className="text-white font-semibold">{i}</span>
            </div>
            {i < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  i < step ? "bg-red-600" : "bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
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
                    <FormLabel className="text-white">Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Select Program</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem
                            key={program.id}
                            value={program.id}
                          >
                            <span>{program.name}</span>
                            <span className="text-red-500 ml-2">
                              {program.price}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">Select Date</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border p-3 bg-white"
                        classNames={{
                          day_selected: "bg-red-600 text-white",
                          day_today: "bg-gray-100 text-gray-900",
                        }}
                        disabled={(date) => date < new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
            <Button type="submit" className="bg-red-600 hover:bg-red-700 ml-auto">
              {step === 3 ? "Complete Booking" : "Next"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}