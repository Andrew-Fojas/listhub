import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "title required"),
  desc: z.string().optional().default(""),
  date: z.string().optional().default(""),
  time: z.string().optional().default(""),
});

export const toggleTaskSchema = z.object({
  done: z.boolean().optional(),
});