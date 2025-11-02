import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "title required"),
  desc: z.string().optional().default(""),
});

export const toggleTaskSchema = z.object({
  done: z.boolean().optional(), // we’ll just flip server-side, but this lets you extend later
});