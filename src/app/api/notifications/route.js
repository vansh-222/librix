import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/notifications
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const query = { userId: session.user.id };
    if (unreadOnly) query.read = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({ userId: session.user.id, read: false });

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// PATCH /api/notifications — mark as read
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { notificationId, markAll } = await req.json();
    await connectDB();

    if (markAll) {
      await Notification.updateMany({ userId: session.user.id, read: false }, { read: true });
    } else if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { read: true });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}

// DELETE /api/notifications — delete one or all notifications
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get('id');
    const deleteAll = searchParams.get('all') === 'true';

    await connectDB();

    if (deleteAll) {
      await Notification.deleteMany({ userId: session.user.id });
    } else if (notificationId) {
      await Notification.findOneAndDelete({ _id: notificationId, userId: session.user.id });
    } else {
      return NextResponse.json({ error: 'Provide id or all=true' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
