import { form, formData } from "./interfaces/FormData";

export const getLocalForms: () => form[] = () => {
  const savedFormsJSON = localStorage.getItem("savedForms");
  return savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
};

export const saveLocalForms = (localForms: form[]) => {
  localStorage.setItem("savedForms", JSON.stringify(localForms));
};
