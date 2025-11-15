import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "title required"),
  desc: z.string().optional().default(""),
  date: z.string().optional().default(""),
  time: z.string().optional().default(""),
  emailReminder: z.boolean().optional().default(false),
  timezoneOffset: z.number().optional().default(0), // User's timezone offset in minutes
});

export const toggleTaskSchema = z.object({
  done: z.boolean().optional(),
});