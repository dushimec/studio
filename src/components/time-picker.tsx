'use client';

import * as React from "react";
import { Label } from "@/components/ui/label";
import { TimeField } from "./ui/time-field";

interface TimePickerProps {
  value: { hour: number; minute: number };
  onChange: (value: { hour: number; minute: number }) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <TimeField
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
