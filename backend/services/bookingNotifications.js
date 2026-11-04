import Booking from "../models/Booking.js";
import { sendBookingConfirmationEmail } from "../configs/mailer.js";

// A short database lease prevents simultaneous confirmation/retry requests from sending twice.
export async function notifyBookingConfirmation(bookingId, ownerId) {
  const sendingAt = new Date();
  const booking = await Booking.findOneAndUpdate({
    _id: bookingId, owner: ownerId, status: "confirmed",
    confirmationEmailSentAt: { $exists: false },
    $or: [{ confirmationEmailSendingAt: { $exists: false } },
      { confirmationEmailSendingAt: { $lte: new Date(Date.now() - 120000) } }]
  }, { $set: { confirmationEmailSendingAt: sendingAt } }, { new: true });
  if (!booking) return false;
  try {
    await booking.populate([
      { path: "car", select: "brand model location" },
      { path: "user", select: "name email" }
    ]);
    await sendBookingConfirmationEmail(booking);
    await Booking.updateOne({ _id: bookingId, confirmationEmailSendingAt: sendingAt }, {
      $set: { confirmationEmailSentAt: new Date() }, $unset: { confirmationEmailSendingAt: "" }
    });
    return true;
  } catch (error) {
    await Booking.updateOne({ _id: bookingId, confirmationEmailSendingAt: sendingAt }, {
      $unset: { confirmationEmailSendingAt: "" }
    });
    throw error;
  }
}
