import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { Alert, Button, Step, StepLabel, Stepper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BarberStep from "../components/booking/BarberStep";
import ServiceStep from "../components/booking/ServiceStep";
import DateTimeStep from "../components/booking/DateTimeStep";
import CustomerInfoStep, { type CustomerInfo } from "../components/booking/CustomerInfoStep";
import ConfirmationStep from "../components/booking/ConfirmationStep";
import { createBooking, getApiErrorMessage } from "../api/client";
import type { Barber, CreateBookingResponse, Service } from "../api/types";

const STEPS = ["Barbero", "Servicio", "Fecha y hora", "Tus datos"];
const EMPTY_CUSTOMER: CustomerInfo = { name: "", phone: "", email: "", notes: "" };

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const preselectedBarberId = searchParams.get("barberId");

  const [step, setStep] = useState(0);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateBookingResponse | null>(null);

  const canGoNext =
    (step === 0 && !!barber) ||
    (step === 1 && !!service) ||
    (step === 2 && !!date && !!time) ||
    (step === 3 && customer.name.trim().length > 1 && customer.phone.trim().length > 5 && customer.email.includes("@"));

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    void handleSubmit();
  };

  const handleSubmit = async () => {
    if (!barber || !service || !date || !time) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await createBooking({
        barberId: barber.id,
        serviceId: service.id,
        date: format(date, "yyyy-MM-dd"),
        startTime: time,
        customerName: customer.name.trim(),
        customerPhone: customer.phone.trim(),
        customerEmail: customer.email.trim(),
        notes: customer.notes.trim() || undefined,
      });
      setResult(res);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForAnotherBooking = () => {
    setResult(null);
    setStep(0);
    setBarber(null);
    setService(null);
    setDate(null);
    setTime(null);
    setCustomer(EMPTY_CUSTOMER);
  };

  if (result) {
    return (
      <section className="bg-brand-black min-h-[70vh]">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16">
          <ConfirmationStep result={result} onBookAnother={resetForAnotherBooking} />
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
          {step === 0 && (
            <BarberStep selected={barber} onSelect={setBarber} preselectedId={preselectedBarberId} />
          )}
          {step === 1 && <ServiceStep selected={service} onSelect={setService} />}
          {step === 2 && barber && service && (
            <DateTimeStep
              barberId={barber.id}
              serviceId={service.id}
              date={date}
              time={time}
              onChangeDate={(d) => {
                setDate(d);
                setTime(null);
              }}
              onChangeTime={setTime}
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
            {step < STEPS.length - 1 ? "Continuar" : submitting ? "Confirmando…" : "Confirmar reserva"}
          </Button>
        </div>
      </div>
    </section>
  );
}
