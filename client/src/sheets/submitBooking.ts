import { sheetsConfig } from "../config/sheets";

export interface BookingSubmission {
  id: string;
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
}

/**
 * Submits a booking straight to the Google Form, which writes it into the
 * private response spreadsheet. There is no server in between.
 *
 * Limitation: the request goes out with `mode: "no-cors"` because Google
 * Forms doesn't send CORS headers, so the browser never lets us read the
 * response — we can't tell success from failure at the network level. We
 * treat "the fetch didn't throw" as success (which is what it'll do for a
 * bad connection, blocked request, etc.); a malformed form field/URL would
 * still silently "succeed" here, which is why docs/google-sheets-setup.md
 * asks you to test the flow end-to-end after wiring the entry IDs.
 */
export async function submitBooking(booking: BookingSubmission): Promise<void> {
  const { entryIds } = sheetsConfig;
  const body = new URLSearchParams({
    [entryIds.id]: booking.id,
    [entryIds.barberId]: booking.barberId,
    [entryIds.serviceId]: booking.serviceId,
    [entryIds.date]: booking.date,
    [entryIds.startTime]: booking.startTime,
    [entryIds.endTime]: booking.endTime,
    [entryIds.customerName]: booking.customerName,
    [entryIds.customerPhone]: booking.customerPhone,
    [entryIds.customerEmail]: booking.customerEmail,
    [entryIds.notes]: booking.notes,
  });

  await fetch(sheetsConfig.formActionUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}
