import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../../data/helpers/constants.ts';

interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
}

export const DateTimePicker = forwardRef((props: DateTimePickerProps, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [formattedDate, setFormattedDate] = useState<string>(props.value ? dayjs(props.value).format(DATE_FORMAT) : "");
  useEffect(() => {
    if (props.value) {
      setFormattedDate(dayjs(props.value).format(DATE_FORMAT));
    }
  }, [props.value]);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    ...(inputRef.current || {}),
  }));

  const handleClick = () => {
    inputRef.current?.showPicker();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFormattedDate(dayjs(newValue).format(DATE_FORMAT));
    if (props.onChange) {
      props.onChange(newValue);
    }
  };

  return (
    <div
      className="w-full border min-h-8 rounded-md cursor-pointer flex items-center border-[#e5e7eb] hover:border-[#1677ff] hover:shadow-[0_0_0_2px_rgba(5,145,255,0.1)] hover:outline-0 focus-within:border-[#1677ff] focus-within:shadow-[0_0_0_2px_rgba(5,145,255,0.1)] focus-within:outline-0"
      onClick={handleClick}
    >
      <input
        min={props.min}
        max={props.max}
        ref={inputRef}
        className="absolute w-full h-full opacity-0 cursor-pointer"
        aria-label="Date and time"
        type="datetime-local"
        onChange={handleChange}
      />
      <span className="px-3">{formattedDate || 'Select Date and Time'}</span>
    </div>
  );
});

DateTimePicker.displayName = "DateTimePicker";