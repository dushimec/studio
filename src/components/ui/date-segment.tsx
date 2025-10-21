'use client';

import { useRef } from 'react';
import { useDateSegment } from '@react-aria/datepicker';

export function DateSegment({ segment, state }: any) {
  let ref = useRef(null);
  let { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
      }}
      className={`px-0.5 box-content tabular-nums text-right rounded-sm focus:bg-accent focus:text-accent-foreground focus:outline-none ${!segment.isEditable ? 'text-muted-foreground' : ''}`}>
      {segment.text}
    </div>
  );
}
