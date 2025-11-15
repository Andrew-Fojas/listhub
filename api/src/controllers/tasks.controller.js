import Task from "../models/Task.js";
import List from "../models/List.js";
import { createTaskSchema } from "../validators/tasks.schema.js";
import { scheduleTaskReminder, cancelScheduledEmail, isValidReminderTime } from "../services/email.service.js";

export async function addTask(req, res){
  const email = req.user.email;
  const { id: listId } = req.params;

  // ensure list belongs to user
  const list = await List.findOne({ _id: listId, ownerEmail: email }).lean();
  if (!list) return res.status(404).json({ error: "List not found" });

  const parse = createTaskSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { title, desc, date, time, emailReminder, timezoneOffset } = parse.data;

  // Validate email reminder requirements
  if (emailReminder) {
    if (!date || !time) {
      return res.status(400).json({ error: "The Date and Time must be filled in to send an email reminder" });
    }
    if (!isValidReminderTime(date, time, timezoneOffset)) {
      return res.status(400).json({ error: "The task must be scheduled 10 minutes in advance of the present moment" });
    }
  }

  let emailScheduledId = "";

  // Schedule email reminder if requested
  if (emailReminder && date && time) {
    try {
      const result = await scheduleTaskReminder({
        to: email,
        taskTitle: title,
        taskDesc: desc,
        taskDate: date,
        taskTime: time,
        timezoneOffset,
      });
      emailScheduledId = result.id;
    } catch (error) {
      console.error("Failed to schedule email reminder:", error);
      return res.status(500).json({ error: `Failed to schedule email reminder: ${error.message}` });
    }
  }

  // stamp ownerEmail on task
  const created = await Task.create({
    listId, title, desc, date, time,
    emailReminder, emailScheduledId,
    done: false, ownerEmail: email
  });

  res.status(201).json({
    id: created._id.toString(),
    listId, title, desc, date, time, emailReminder, done: false
  });
}

export async function toggleTask(req, res){
  const email = req.user.email;
  const { id } = req.params;

  // task must belong to user
  const task = await Task.findOne({ _id: id, ownerEmail: email });
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.done = !task.done;
  await task.save();

  res.json({
    id: task._id.toString(),
    listId: task.listId.toString(),
    title: task.title, desc: task.desc, date: task.date, time: task.time, emailReminder: task.emailReminder, done: task.done
  });
}

export async function updateTask(req, res){
  const email = req.user.email;
  const { id } = req.params;
  const { title, desc, date, time, emailReminder } = req.body || {};

  const task = await Task.findOne({ _id: id, ownerEmail: email });
  if (!task) return res.status(404).json({ error: "Task not found" });

  // Handle email reminder changes
  if (typeof emailReminder === "boolean") {
    // If trying to enable email reminder
    if (emailReminder && !task.emailReminder) {
      const taskDate = typeof date === "string" ? date : task.date;
      const taskTime = typeof time === "string" ? time : task.time;

      if (!taskDate || !taskTime) {
        return res.status(400).json({ error: "The Date and Time must be filled in to send an email reminder" });
      }
      if (!isValidReminderTime(taskDate, taskTime)) {
        return res.status(400).json({ error: "The task must be scheduled 10 minutes in advance of the present moment" });
      }

      // Schedule new email
      try {
        const result = await scheduleTaskReminder({
          to: email,
          taskTitle: typeof title === "string" ? title.trim() : task.title,
          taskDesc: typeof desc === "string" ? desc : task.desc,
          taskDate,
          taskTime,
        });
        task.emailScheduledId = result.id;
        task.emailReminder = true;
      } catch (error) {
        return res.status(500).json({ error: "Failed to schedule email reminder" });
      }
    }
    // trying to disable email reminder
    else if (!emailReminder && task.emailReminder) {
      const taskDate = task.date;
      const taskTime = task.time;

      // Check if task is still more than 10 minutes away
      if (!isValidReminderTime(taskDate, taskTime)) {
        return res.status(400).json({ error: "The task reminder has already been sent out" });
      }

      // Cancel the scheduled email
      try {
        await cancelScheduledEmail(task.emailScheduledId);
        task.emailReminder = false;
        task.emailScheduledId = "";
      } catch (error) {
        return res.status(500).json({ error: "Failed to cancel email reminder" });
      }
    }
  }

  if (typeof title === "string") task.title = title.trim();
  if (typeof desc  === "string") task.desc  = desc;
  if (typeof date  === "string") task.date  = date;
  if (typeof time  === "string") task.time  = time;
  await task.save();

  res.json({
    id: task._id.toString(),
    listId: task.listId.toString(),
    title: task.title, desc: task.desc, date: task.date, time: task.time, emailReminder: task.emailReminder, done: task.done
  });
}

export async function deleteTask(req, res){
  const email = req.user.email;
  const { id } = req.params;

  const task = await Task.findOne({ _id: id, ownerEmail: email });
  if (!task) return res.status(404).json({ error: "Task not found" });

  // Cancel scheduled email if exists
  if (task.emailScheduledId) {
    try {
      await cancelScheduledEmail(task.emailScheduledId);
    } catch (error) {
      console.error("Failed to cancel email on delete:", error);
    }
  }

  await Task.deleteOne({ _id: id, ownerEmail: email });

  res.json({ ok: true, id });
}
