import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Librix <notifications@librix.app>';

export async function sendNotificationEmail({ to, subject, html }) {
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
    return true;
  } catch (err) {
    console.error('[Email Error]', err);
    return false;
  }
}

export function requestApprovedEmail({ userName, bookTitle, dueDate }) {
  return {
    subject: `Your book request has been approved — ${bookTitle}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0F1117;color:#F1F5F9;border-radius:12px;padding:32px;">
        <h1 style="color:#6366F1;margin-bottom:8px;">📚 Request Approved</h1>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Your request for <strong>${bookTitle}</strong> has been approved.</p>
        <p>Please collect your book from the library by <strong>${dueDate}</strong>.</p>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px;">Librix — Smart Library Management</p>
      </div>
    `,
  };
}

export function returnReminderEmail({ userName, bookTitle, dueDate }) {
  return {
    subject: `Return reminder — ${bookTitle} due ${dueDate}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0F1117;color:#F1F5F9;border-radius:12px;padding:32px;">
        <h1 style="color:#F59E0B;margin-bottom:8px;">⏰ Return Reminder</h1>
        <p>Hi <strong>${userName}</strong>,</p>
        <p><strong>${bookTitle}</strong> is due on <strong>${dueDate}</strong>.</p>
        <p>Please return it on time to avoid fines.</p>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px;">Librix — Smart Library Management</p>
      </div>
    `,
  };
}

export function fineAddedEmail({ userName, bookTitle, fineAmount, symbol }) {
  return {
    subject: `Fine added — ${symbol}${fineAmount} for ${bookTitle}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0F1117;color:#F1F5F9;border-radius:12px;padding:32px;">
        <h1 style="color:#EF4444;margin-bottom:8px;">💰 Fine Added</h1>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>A fine of <strong>${symbol}${fineAmount}</strong> has been added for <strong>${bookTitle}</strong>.</p>
        <p>Please clear it at the library at your earliest convenience.</p>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px;">Librix — Smart Library Management</p>
      </div>
    `,
  };
}

export function reservationAvailableEmail({ userName, bookTitle }) {
  return {
    subject: `Your reserved book is available — ${bookTitle}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0F1117;color:#F1F5F9;border-radius:12px;padding:32px;">
        <h1 style="color:#22C55E;margin-bottom:8px;">✅ Book Available</h1>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Your reserved book <strong>${bookTitle}</strong> is now available!</p>
        <p>Please collect it within <strong>48 hours</strong> or your reservation will expire.</p>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px;">Librix — Smart Library Management</p>
      </div>
    `,
  };
}
