"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Get in touch with us to start your racing journey or learn more about our programs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <Input type="email" placeholder="Email" />
              <Input type="tel" placeholder="Phone" />
              <Textarea placeholder="Message" className="h-32" />
              <Button className="w-full bg-racing-red hover:bg-red-700">
                Send Message
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-racing-red shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Location</h3>
                    <p className="text-gray-500">
                      Piquet Race Park<br />
                      Wellington, FL 33414
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-racing-red shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <p className="text-gray-500">(555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-racing-red shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-gray-500">info@akwracing.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}