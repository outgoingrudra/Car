const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

export function bookingConfirmationMessage(booking) {
  const car = booking.car;
  const name = booking.user?.name || "there";
  const carName = car ? `${car.brand} ${car.model}` : "Your reserved car";
  const location = car?.location || "Please contact the owner for pickup details";
  const formatDate = (date) => new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC"
  }).format(new Date(date));
  const pickup = formatDate(booking.pickupDate);
  const dropoff = formatDate(booking.returnDate);
  const total = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(booking.price);
  const reference = String(booking._id);
  const row = (label, value) => `<tr><td style="padding:12px 0;border-bottom:1px solid #e7edf4;color:#64748b;font-size:14px;vertical-align:top;width:38%">${label}</td><td style="padding:12px 0;border-bottom:1px solid #e7edf4;color:#172b4d;font-size:15px;font-weight:600;text-align:right;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`;
  return {
    subject: "Booking confirmed — your car is reserved",
    text: `Hi ${name},\n\nYour owner has confirmed your car reservation.\n\nCar: ${carName}\nPickup: ${pickup}\nReturn: ${dropoff}\nPickup location: ${location}\nBooking total: ${total}\nBooking reference: ${reference}\n\nPayment is arranged offline. This confirmation is not a payment receipt.\nReview your booking in My Bookings. Cancellation is available before pickup day.\n\nHave a great trip!\nCar Rental`,
    html: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Booking confirmed</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#172b4d">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">Your ${escapeHtml(carName)} reservation is confirmed. Pickup on ${escapeHtml(pickup)}.</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
<tr><td style="padding:28px 32px;background:#132a4a;color:#ffffff"><span style="font-size:20px;font-weight:700;letter-spacing:1px">CAR RENTAL</span><p style="margin:7px 0 0;color:#b9cce5;font-size:13px">A good trip starts here.</p></td></tr>
<tr><td style="padding:32px">
<span style="display:inline-block;padding:7px 12px;border-radius:20px;background:#e7f7ef;color:#167348;font-size:12px;font-weight:700;letter-spacing:1px">BOOKING CONFIRMED</span>
<h1 style="font-size:30px;line-height:1.2;letter-spacing:-1px;margin:20px 0 12px;color:#132a4a">You're all set.</h1>
<p style="font-size:16px;line-height:1.65;color:#526176;margin:0 0 24px">Hi ${escapeHtml(name)},<br>Your owner has accepted your reservation. Here are the details for your upcoming trip.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:2px solid #2563eb">
${row("Your car", carName)}${row("Pickup date", pickup)}${row("Return date", dropoff)}${row("Pickup location", location)}
<tr><td style="padding:20px 0;font-size:15px;font-weight:700">Booking total</td><td style="padding:20px 0;font-size:25px;font-weight:700;color:#2563eb;text-align:right">${escapeHtml(total)}</td></tr></table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="background:#f0f6ff;border:1px solid #dbeafe;border-radius:10px;padding:16px 18px">
<p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#234877">Before you go</p><p style="margin:0;font-size:13px;line-height:1.7;color:#526176">Review your reservation in <strong>My Bookings</strong>. You can cancel before pickup day. Payment is arranged offline; this email is not a payment receipt.</p>
</td></tr></table>
<p style="margin:24px 0 0;font-size:15px;color:#526176;line-height:1.6">Have a great trip,<br><strong style="color:#132a4a">The Car Rental team</strong></p>
</td></tr>
<tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e7edf4"><p style="margin:0;font-size:11px;line-height:1.7;color:#64748b;overflow-wrap:anywhere">BOOKING REFERENCE<br><strong>${escapeHtml(reference)}</strong></p></td></tr>
</table><p style="font-size:12px;line-height:1.6;color:#7b8799;margin:20px 0 0">Sent because your car reservation was confirmed.</p>
</td></tr></table></body></html>`
  };
}
