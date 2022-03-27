import { formData } from "./interfaces/FormData";

export const getLocalForms: () => formData[] = () => {
  const savedFormsJSON = localStorage.getItem("savedForms");
  return savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
};

export const saveLocalForms = (localForms: formData[]) => {
  localStorage.setItem("savedForms", JSON.stringify(localForms));
};
