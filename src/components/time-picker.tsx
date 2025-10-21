'use client';

import * as React from "react";
import { Label } from "@/components/ui/label";
import { TimeField } from "./ui/time-field";

interface TimePickerProps {
  value: { hour: number; minute: number };
  onChange: (value: { hour: number; minute: number }) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const handleChange = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    onChange({ hour, minute });
  };

  const formatTime = (time: { hour: number; minute: number }) => {
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(time.hour)}:${pad(time.minute)}`;
  };

  return (
    <div className="flex items-center gap-2">
      <TimeField
        value={formatTime(value)}
        onChange={handleChange}
      />
    </div>
  );
}
