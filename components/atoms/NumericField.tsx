import React, { useEffect, useState } from 'react';
import Input from './Input';

interface NumericFieldProps {
  value?: number | null;
  onChange: (n: number) => void;
  integer?: boolean; // true => integer-only, false => float
  maxIntegerDigits?: number;
  maxDecimals?: number; // only used when integer === false
  placeholder?: string;
  label?: string;
  error?: string;
  allowNegative?: boolean;
  // color props forwarded to the underlying Input atom
  borderColor?: string;
  backgroundColor?: string;
  labelColor?: string;
  textColor?: string;
  errorColor?: string;
  placeholderColor?: string;
}

/**
 * NumericField
 * - Keeps an internal text buffer so users can type floats without the cursor jumping
 * - Supports integer mode and float mode
 * - Limits integer and decimal digits to avoid Infinity/overflow
 */
export default function NumericField({
  value,
  onChange,
  integer = false,
  maxIntegerDigits = 18,
  maxDecimals = 6,
  placeholder,
  label,
  error,
  allowNegative = false,
  borderColor,
  backgroundColor,
  labelColor,
  textColor,
  errorColor,
  placeholderColor,
}: NumericFieldProps) {
  const [text, setText] = useState<string>(
    value !== undefined && value !== null ? String(value) : ''
  );

  // sync from external value when it changes
  useEffect(() => {
    const numeric = value !== undefined && value !== null ? String(value) : '';
    if (numeric !== text) setText(numeric);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (input: string) => {
    let sanitized = input;

    // Allow negative sign only at the start if enabled
    const negative = allowNegative && sanitized.startsWith('-');
    if (negative) sanitized = sanitized.slice(1);

    // Keep only digits and dot
    sanitized = sanitized.replace(/[^0-9.]/g, '');

    // If integer mode, strip decimal part
    if (integer) {
      sanitized = sanitized.split('.')[0] || '';
    } else {
      // Float mode: ensure single dot
      const parts = sanitized.split('.');
      if (parts.length > 2) {
        sanitized = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    // Limit integer digits
    const [intPart, decPart] = sanitized.split('.');
    let limitedInt = intPart || '';
    if (limitedInt.length > maxIntegerDigits) {
      limitedInt = limitedInt.slice(0, maxIntegerDigits);
    }

    let result = limitedInt;
    if (!integer && decPart !== undefined) {
      let limitedDec = decPart;
      if (maxDecimals !== undefined && maxDecimals >= 0) {
        limitedDec = limitedDec.slice(0, maxDecimals);
      }
      result = `${limitedInt}.${limitedDec}`;
    }

    if (negative) result = `-${result}`;

    setText(result);

    // Decide when to call onChange:
    // - empty or just '-' => treat as 0 (keeps previous behavior in the form)
    // - '.' or '-.' or '0.' => treat as 0
    if (result === '' || result === '-' || result === '.' || result === '-.' || result === '0.') {
      onChange(0);
      return;
    }

    // Parse value and ensure finite
    const parsed = integer ? parseInt(result, 10) : parseFloat(result);
    if (Number.isFinite(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={text}
      onChangeText={handleChange}
      error={error}
      keyboardType="numeric"
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      labelColor={labelColor}
      textColor={textColor}
      errorColor={errorColor}
      placeholderColor={placeholderColor}
    />
  );
}
