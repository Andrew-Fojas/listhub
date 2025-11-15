import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


/**
 *  Schedules an email reminder for a task
 * @param {Object} options --> Email scheduling options
 * @param {string} options.to --> Recipient email address
 * @param {string} options.taskTitle --> Title of the task
 * @param {string} options.taskDesc -->  Description of the task (optional)
 * @param {string} options.taskDate --> Date of the task (YYYY-MM-DD)
 * @param {string} options.taskTime --> Time of the task (HH:MM)
 * @returns {Promise<{id: string}>} --> Returns the scheduled email ID
*/
 
export async function scheduleTaskReminder({ to, taskTitle, taskDesc, taskDate, taskTime }) {
  // Calculate scheduled send time (10 minutes before task time)
  const [year, month, day] = taskDate.split("-");
  const [hours, minutes] = taskTime.split(":");

  const taskDateTime = new Date(year, month - 1, day, hours, minutes);
  const reminderTime = new Date(taskDateTime.getTime() - 10 * 60 * 1000); // 10 minutes before

  // Format date and time for email
  const formattedDate = `${month}/${day}/${year}`;
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  const formattedTime = `${hour12}:${minutes} ${ampm}`;

  // Build email HTML body
  let html = `Hello from ListHub!\n\nYour task, ${taskTitle}, is scheduled to take place on ${formattedDate} at ${formattedTime}.`;

  // add optional description
  if (taskDesc && taskDesc.trim()) {
    html += `\n\nThis is the description included with your task: ${taskDesc}`;
  }

  try {
    // Use custom domain from env or fall back to resend.dev for testing
    const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

    const response = await resend.emails.send({
      from: `ListHub <${fromEmail}>`,
      to: [to],
      subject: `Task Reminder - ${taskTitle}`,
      html: html.replace(/\n/g, "<br>"),
      scheduledAt: reminderTime.toISOString(),
    });

    return { id: response.id };
  } catch (error) {
    console.error("Failed to schedule email:", error);
    throw new Error("Failed to schedule email reminder");
  }
}

/**
 * Cancels a scheduled email
 * @param {string} emailId --> The scheduled email ID to cancel
 * @returns {Promise<void>}
 */
export async function cancelScheduledEmail(emailId) {
  if (!emailId) return;

  try {
    await resend.emails.cancel(emailId);
  } catch (error) {
    console.error("Failed to cancel scheduled email:", error);
    throw new Error("Failed to cancel email reminder");
  }
}

/**
 * Validates that the task is scheduled at least 10 minutes in the future
 * @param {string} date - Task date (YYYY-MM-DD)
 * @param {string} time - Task time (HH:MM)
 * @param {number} timezoneOffset - User's timezone offset in minutes (from Date.getTimezoneOffset())
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidReminderTime(date, time, timezoneOffset = 0) {
  if (!date || !time) return false;

  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");

  // Create date treating time as UTC, then adjust for user's timezone
  // getTimezoneOffset() returns positive for timezones behind UTC (e.g., PST = +480)
  // User's local time needs to be converted to UTC by adding the offset
  const taskDateTime = new Date(year, month - 1, day, hours, minutes);
  // Add the user's timezone offset to convert local time to UTC
  taskDateTime.setMinutes(taskDateTime.getMinutes() + timezoneOffset);

  const now = new Date();
  const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

  const diffMinutes = (taskDateTime - now) / (60 * 1000);
  console.log(`Task time validation: task=${taskDateTime.toISOString()}, now=${now.toISOString()}, diff=${diffMinutes.toFixed(2)} minutes, offset=${timezoneOffset}`);

  return taskDateTime > tenMinutesFromNow;
}
