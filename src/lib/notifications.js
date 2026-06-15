import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { sendNotificationEmail } from './email';

/**
 * Create a notification (in-app + optional email)
 */
export async function createNotification({
  userId,
  collegeId = null,
  title,
  message,
  type = 'general',
  link = '',
  sendEmail = false,
  emailTemplate = null, // { subject, html }
}) {
  await connectDB();

  const notification = await Notification.create({
    userId,
    collegeId,
    title,
    message,
    type,
    link,
  });

  if (sendEmail && emailTemplate) {
    const user = await User.findById(userId).select('email').lean();
    if (user?.email) {
      const sent = await sendNotificationEmail({
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
      if (sent) {
        await Notification.findByIdAndUpdate(notification._id, { emailSent: true });
      }
    }
  }

  return notification;
}

/**
 * Bulk notify multiple users
 */
export async function bulkNotify(userIds, basePayload) {
  await connectDB();
  const notifications = userIds.map((userId) => ({ userId, ...basePayload }));
  return Notification.insertMany(notifications);
}
