"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="bg-racing-gray border-racing-gray text-white placeholder:text-gray-400"
        required
      />
      <Button 
        type="submit"
        className="w-full bg-racing-red hover:bg-red-700"
      >
        Subscribe
      </Button>
    </form>
  );
}