import { TextField } from "@mui/material";

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

interface Props {
  value: CustomerInfo;
  onChange: (value: CustomerInfo) => void;
}

export default function CustomerInfoStep({ value, onChange }: Props) {
  const set = (field: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [field]: e.target.value });

  return (
    <div className="grid gap-5 max-w-lg">
      <TextField
        label="Nombre completo"
        value={value.name}
        onChange={set("name")}
        required
        fullWidth
        autoComplete="name"
      />
      <TextField
        label="Teléfono"
        placeholder="+56 9 1234 5678"
        value={value.phone}
        onChange={set("phone")}
        required
        fullWidth
        autoComplete="tel"
      />
      <TextField
        label="Email"
        type="email"
        value={value.email}
        onChange={set("email")}
        required
        fullWidth
        autoComplete="email"
      />
      <TextField
        label="Notas (opcional)"
        placeholder="Alguna preferencia para tu corte…"
        value={value.notes}
        onChange={set("notes")}
        fullWidth
        multiline
        minRows={2}
      />
    </div>
  );
}
