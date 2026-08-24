"use client";

import { DEFAULT_PHONE_COUNTRY } from "@/lib/phone";

const COUNTRY_OPTIONS = [
  { code: "AE", dial: "+971", label: "🇦🇪 +971" },
  { code: "SA", dial: "+966", label: "🇸🇦 +966" },
  { code: "KW", dial: "+965", label: "🇰🇼 +965" },
  { code: "QA", dial: "+974", label: "🇶🇦 +974" },
  { code: "BH", dial: "+973", label: "🇧🇭 +973" },
  { code: "OM", dial: "+968", label: "🇴🇲 +968" },
  { code: "JO", dial: "+962", label: "🇯🇴 +962" },
  { code: "EG", dial: "+20", label: "🇪🇬 +20" },
] as const;

export type PhoneInputValue = {
  dialCode: string;
  national: string;
};

export function phoneValueToRaw({ dialCode, national }: PhoneInputValue): string {
  const digits = national.replace(/\D/g, "");
  return `${dialCode}${digits}`;
}

export function defaultPhoneValue(): PhoneInputValue {
  const uae = COUNTRY_OPTIONS.find((c) => c.code === DEFAULT_PHONE_COUNTRY)!;
  return { dialCode: uae.dial, national: "" };
}

interface Props {
  value: PhoneInputValue;
  onChange: (value: PhoneInputValue) => void;
  disabled?: boolean;
  required?: boolean;
  inputStyle?: React.CSSProperties;
  className?: string;
  /** Narrower dial-code select so the national number gets more room. */
  compact?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  disabled,
  required = true,
  inputStyle,
  className,
  compact = false,
}: Props) {
  return (
    <div className={className} style={{ display: "flex", gap: compact ? 3 : 6, direction: "ltr" }}>
      <select
        value={value.dialCode}
        onChange={(e) => onChange({ ...value, dialCode: e.target.value })}
        disabled={disabled}
        required={required}
        style={{
          ...inputStyle,
          flex: compact ? "0 0 2.85rem" : "0 0 4.5rem",
          width: compact ? "2.85rem" : "4.5rem",
          minWidth: 0,
          padding: compact ? "0 12px 0 2px" : "0 6px",
          textAlign: "center",
        }}
        aria-label="رمز الدولة"
      >
        {COUNTRY_OPTIONS.map((c) => (
          <option key={c.code} value={c.dial}>
            {compact ? c.dial : c.label}
          </option>
        ))}
      </select>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="50 123 4567"
        value={value.national}
        onChange={(e) => onChange({ ...value, national: e.target.value })}
        disabled={disabled}
        required={required}
        style={{ ...inputStyle, flex: "1 1 auto", minWidth: 0 }}
        aria-label="رقم الجوال"
      />
    </div>
  );
}
