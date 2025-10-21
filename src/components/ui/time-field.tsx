'use client';
import { Time, parseTime } from '@internationalized/date';
import { useTimeField } from "@react-aria/datepicker";
import { useTimeFieldState } from "@react-stately/datepicker";
import { useLocale } from '@react-aria/i18n';
import { forwardRef } from 'react';
import { DateSegment } from './date-segment';

const TimeField = forwardRef((props: any, ref: any) => {
  const { locale } = useLocale();
  const state = useTimeFieldState({
    ...props,
    locale,
    value: props.value ? parseTime(props.value) : null,
    onChange: (v) => props.onChange(v ? v.toString() : null),
  });

  const { fieldProps } = useTimeField(props, state, ref);

  return (
    <div {...fieldProps} ref={ref} className="inline-flex h-10 w-full flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
});

TimeField.displayName = 'TimeField';

export { TimeField };
