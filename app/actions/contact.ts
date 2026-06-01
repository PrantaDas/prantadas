"use server";

import { z } from "zod";
import { sendContactEmails } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(2000),
});

export interface ContactResult {
  success: boolean;
  error?: string;
}

export async function submitContactForm(
  input: unknown,
): Promise<ContactResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data. Please check your inputs." };
  }

  try {
    await sendContactEmails(parsed.data);
    return { success: true };
  } catch (err) {
    console.error("[contact] email error:", err);
    return { success: false, error: "Failed to send message. Please try again or email me directly." };
  }
}
