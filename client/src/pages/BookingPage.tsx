import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Button, CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ServiceStep from "../components/booking/ServiceStep";
import DateTimeStep from "../components/booking/DateTimeStep";
import BarberAtSlotStep from "../components/booking/BarberAtSlotStep";
import CustomerInfoStep, { type CustomerInfo } from "../components/booking/CustomerInfoStep";
import ConfirmationStep from "../components/booking/ConfirmationStep";
import { useBookingData } from "../hooks/useBookingData";
import { submitBooking } from "../sheets/submitBooking";
import { fetchBusySlots } from "../sheets/repository";
import { addMinutes, computeAvailableSlots } from "../lib/slots";
import type { Barber, Service } from "../sheets/types";

const STEPS = ["Servicio", "Fecha y hora", "Barbero", "Tus datos"];
const EMPTY_CUSTOMER: CustomerInfo = { name: "", phone: "", email: "", notes: "" };

function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const preselectedBarberId = searchParams.get("barberId");

  const { barbers, services, workingHours, busySlots, loading, error, refetch } = useBookingData();

  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const canGoNext =
    (step === 0 && !!service) ||
    (step === 1 && !!date && !!time) ||
    (step === 2 && !!barber) ||
    (step === 3 && customer.name.trim().length > 1 && customer.phone.trim().length > 5 && customer.email.includes("@"));

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    void handleSubmit();
  };

  const handleSubmit = async () => {
    if (!service || !date || !time || !barber) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      // No hay servidor que valide esto de forma atómica, así que
      // volvemos a chequear justo antes de escribir. Reduce el riesgo de
      // que dos personas reserven el mismo horario a la vez, aunque no lo
      // elimina del todo (ver docs/google-sheets-setup.md).
      const freshBusySlots = await fetchBusySlots();
      const stillFree = computeAvailableSlots({
        date: toDateStr(date),
        barberId: barber.id,
        durationMin: service.durationMin,
        workingHours,
        busySlots: freshBusySlots,
      }).includes(time);
      if (!stillFree) {
        setSubmitError("Justo se ocupó ese horario. Vuelve al paso de horario y elige otro.");
        setSubmitting(false);
        return;
      }

      const id = crypto.randomUUID();
      await submitBooking({
        id,
        barberId: barber.id,
        serviceId: service.id,
        date: toDateStr(date),
        startTime: time,
        endTime: addMinutes(time, service.durationMin),
        customerName: customer.name.trim(),
        customerPhone: customer.phone.trim(),
        customerEmail: customer.email.trim(),
        notes: customer.notes.trim(),
      });
      setConfirmedId(id);
    } catch {
      setSubmitError(
        "No pudimos enviar la reserva. Revisa tu conexión e intenta de nuevo; si el problema persiste, escríbenos por Instagram.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForAnotherBooking = () => {
    setConfirmedId(null);
    setStep(0);
    setService(null);
    setDate(null);
    setTime(null);
    setBarber(null);
    setCustomer(EMPTY_CUSTOMER);
    void refetch();
  };

  if (loading) {
    return (
      <section className="bg-brand-black min-h-[70vh] flex items-center justify-center">
        <CircularProgress color="primary" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-brand-black min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button onClick={() => refetch()} variant="outlined" color="primary">
            Reintentar
          </Button>
        </div>
      </section>
    );
  }

  if (confirmedId && service && date && barber && time) {
    return (
      <section className="bg-brand-black min-h-[70vh]">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16">
          <ConfirmationStep
            bookingId={confirmedId}
            barber={barber}
            service={service}
            date={toDateStr(date)}
            startTime={time}
            onBookAnother={resetForAnotherBooking}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-black min-h-[70vh]">
      <div className="mx-auto max-w-4xl px-4 md:px-6 py-14">
        <h1 className="font-display text-4xl md:text-5xl text-brand-cream text-center mb-10">Reservar hora</h1>

        <Stepper activeStep={step} alternativeLabel sx={{ mb: 6 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className="min-h-[320px]">
          {step === 0 && <ServiceStep services={services} selected={service} onSelect={setService} />}

          {step === 1 && service && (
            <DateTimeStep
              barberIds={barbers.map((b) => b.id)}
              durationMin={service.durationMin}
              workingHours={workingHours}
              busySlots={busySlots}
              date={date}
              time={time}
              onChangeDate={(d) => {
                setDate(d);
                setTime(null);
                setBarber(null);
              }}
              onChangeTime={(t) => {
                setTime(t);
                setBarber(null);
              }}
            />
          )}

          {step === 2 && service && date && time && (
            <BarberAtSlotStep
              barbers={barbers}
              durationMin={service.durationMin}
              workingHours={workingHours}
              busySlots={busySlots}
              date={date}
              time={time}
              selected={barber}
              onSelect={setBarber}
              preselectedId={preselectedBarberId}
            />
          )}

          {step === 3 && <CustomerInfoStep value={customer} onChange={setCustomer} />}
        </div>

        {submitError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {submitError}
          </Alert>
        )}

        <div className="flex justify-between mt-10">
          <Button
            onClick={() => setStep(step - 1)}
            disabled={step === 0 || submitting}
            startIcon={<ArrowBackIcon />}
            color="inherit"
          >
            Atrás
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canGoNext || submitting}
            variant="contained"
            color="primary"
            endIcon={step < STEPS.length - 1 ? <ArrowForwardIcon /> : undefined}
          >
            {step < STEPS.length - 1 ? "Continuar" : submitting ? "Enviando…" : "Confirmar reserva"}
          </Button>
        </div>
      </div>
    </section>
  );
}
