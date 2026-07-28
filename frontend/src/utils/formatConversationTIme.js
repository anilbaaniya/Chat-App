import {
  format,
  isToday,
  isYesterday,
  differenceInCalendarDays,
} from "date-fns";

export const formatConversationTime = (date) => {
  if (!date) return "";

  const messageDate = new Date(date);
  const today = new Date();

  // Today -> 2:45 PM
  if (isToday(messageDate)) {
    return format(messageDate, "h:mm a");
  }

  // Yesterday
  if (isYesterday(messageDate)) {
    return "Yesterday";
  }

  // Within last 7 days -> Monday
  if (differenceInCalendarDays(today, messageDate) < 7) {
    return format(messageDate, "EEEE");
  }

  // This year -> Jul 28
  if (messageDate.getFullYear() === today.getFullYear()) {
    return format(messageDate, "MMM d");
  }

  // Older -> Jul 28, 2025
  return format(messageDate, "MMM d, yyyy");
};
