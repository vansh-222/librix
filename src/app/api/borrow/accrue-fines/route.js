import connectDB from "@/lib/db";
import BorrowRecord from "@/models/BorrowRecord";
import College from "@/models/College";
import { createNotification } from "@/lib/notifications";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// POST /api/borrow/accrue-fines
// Calculates and writes the running fine for all overdue issued books for the current student.
export async function POST() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const userId = session.user.id;
    const now = new Date();

    // Find all overdue, still-issued records for this user
    const overdueRecords = await BorrowRecord.find({
      userId,
      status: { $in: ["issued", "return_pending"] },
      dueDate: { $lt: now },
      fineStatus: { $nin: ["paid", "waived"] },
    }).populate("bookId", "title");

    if (overdueRecords.length === 0) {
      return NextResponse.json({ updated: 0 });
    }

    const college = await College.findById(session.user.collegeId).select("settings").lean();
    const finePerDay = college?.settings?.finePerDay || 50;

    let updated = 0;
    const notifications = [];

    for (const record of overdueRecords) {
      const dueDate = new Date(record.dueDate);
      const lateDays = Math.max(1, Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24)));
      const liveFine = lateDays * finePerDay;

      if (liveFine !== record.fine) {
        const wasZero = record.fine === 0;
        record.fine = liveFine;
        record.fineStatus = "pending";
        await record.save();
        updated++;

        if (wasZero) {
          notifications.push(
            createNotification({
              userId,
              collegeId: session.user.collegeId,
              title: "Overdue Fine Added",
              message: `"${record.bookId?.title || "A book"}" is overdue by ${lateDays} day${lateDays !== 1 ? "s" : ""}. A fine of Rs.${liveFine} has been applied.`,
              type: "fine_added",
              link: "/student/fines",
            })
          );
        }
      }
    }

    if (notifications.length > 0) {
      await Promise.all(notifications);
    }

    return NextResponse.json({ updated, finePerDay });
  } catch (err) {
    console.error("[accrue-fines]", err);
    return NextResponse.json({ error: "Failed to accrue fines" }, { status: 500 });
  }
}
