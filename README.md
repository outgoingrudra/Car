# Car Rental

A small MERN app for browsing and booking cars. Renters can search by location and dates, filter and sort results, book a car, and cancel a reservation before pickup. Owners can list cars and review booking requests.

## Run locally

Use Node.js 20 or newer and a MongoDB database. The backend and frontend have separate `package.json` files.

1. In `backend`, run `npm install` and fill in `.env` (copy `.env.example` if it is missing):

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017
   JWT_SECRET=replace-with-a-long-random-secret
   IMAGEKIT_PUBLIC_KEY=your-public-key
   IMAGEKIT_PRIVATE_KEY=your-private-key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
   ADMIN_EMAIL=your-address@gmail.com
   ADMIN_APP_PASSWORD=your-google-app-password
   PORT=3000
   ```

2. In `frontend`, run `npm install` and fill in `.env` (copy `.env.example` if it is missing):

   ```env
   VITE_BASE_URL=http://localhost:3000
   VITE_CURRENCY=₹
   ```

3. Start the backend with `npm run server` from `backend`, then start the frontend with `npm run dev` from `frontend`. Open the URL printed by Vite.

Registration sends a six digit code through Gmail. The code expires after 10 minutes; users can request another after one minute. To enable sending, put your Gmail address in `ADMIN_EMAIL` and a Google App Password in `ADMIN_APP_PASSWORD`. Nodemailer supplies the Gmail server settings automatically, and the sender is your admin address. [Nodemailer Gmail setup](https://nodemailer.com/guides/using-gmail)

To create an App Password, turn on Google 2-Step Verification, then open [Google App Passwords](https://myaccount.google.com/apppasswords). Copy the generated password into `backend/.env`. Your ordinary Gmail password will not work. Some Google accounts do not offer App Passwords; see [Google's eligibility notes](https://support.google.com/accounts/answer/185833).

ImageKit credentials are needed to upload car and profile images. Keep both `.env` files private. Existing accounts created before email verification remain usable.

## Checks

- `cd frontend && npm run build` checks the production frontend bundle.

The backend uses the `car-rental` database by default. Set `MONGODB_DB_NAME` in `backend/.env` to select another database. Keep `MONGODB_URI` exactly as supplied by MongoDB, including any query parameters.

The app uses one Express API and one React frontend. There is no payment processing; bookings are reservations managed by owners.

## Account recovery and owner tools

- **Forgot password:** Open Login → Forgot password, enter the account email, then enter the emailed code and a new password. Reset codes expire after 10 minutes, allow five attempts, and can be requested once per minute. A successful reset invalidates existing sessions and requires a fresh login. Signup verification codes cannot be used as reset codes.
- **Edit a listing:** Open Owner → Manage Cars → Edit. Owners can update car details and optionally replace the photo (JPG, PNG or WebP, up to 5 MB). Keeping the photo field empty preserves the current image. Existing booking totals are unchanged.
- **Renter details:** Manage Bookings shows the renter's account name, email, and profile photo, with initials when no photo is available. This information is visible only to the owner of the booked car. Names and photos are supplied by the account holder, rather than identity verification.

When an owner confirms a pending booking, the renter receives a styled confirmation email with the car, pickup and return dates, location, total in INR, and booking reference. This uses the same Gmail settings as OTP emails. Plain text is included for email clients that do not show HTML.

If sending fails, the booking stays confirmed and Manage Bookings shows **Retry email**. Successfully sent emails are marked so repeated confirmation requests do not send again. A temporary lock prevents concurrent sends; after an interrupted request, retry becomes available after two minutes. As with SMTP generally, an interruption after delivery but before saving the result can still cause a duplicate on retry.
