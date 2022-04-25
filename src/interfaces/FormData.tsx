import { formField } from "./FormField";

export type formData = {
  id: number;
  title: string;
  formFields: formField[];
};

export type form = {
  id?: number;
  title: string;
  description?: string;
  is_public?: boolean;
};

export type Errors<T> = Partial<Record<keyof T, string>>;

export const validateForm = (form: form) => {
  const errors: Errors<form> = {};
  if (form.title.length < 1) {
    errors.title = "Title is required";
  }
  if (form.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }
  return errors;
};
