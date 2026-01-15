"use client";
import type React from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input } from "../../ui/input/Input";

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder: string;
  title: string;
  type?: string;
  rightElement?: React.ReactNode;
  rightInputElement?: React.ReactNode;
}

export const InputFormField = <T extends FieldValues>({
  form,
  name,
  placeholder,
  title,
  type = "text",
  rightElement,
  rightInputElement,
}: Props<T>) => {
  const error = form.formState.errors[name]?.message as string;

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { ref, ...field } }) => (
        <Input
          {...field}
          ref={ref}
          id={name}
          type={type}
          placeholder={placeholder}
          label={title}
          error={error}
          rightElement={rightElement}
          rightInputElement={rightInputElement}
        />
      )}
    />
  );
};
