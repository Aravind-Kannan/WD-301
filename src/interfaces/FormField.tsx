export type textFieldTypes = "text" | "email" | "date";
export type fieldTypes =
  | "text"
  | "dropdown"
  | "textArea"
  | "radioInput"
  | "multipleSelect";

export type TextField = {
  kind: "text";
  id: number;
  label: string;
  fieldType: textFieldTypes;
  value: string;
};

export type DropdownField = {
  kind: "dropdown";
  id: number;
  label: string;
  options: string[];
  value: string;
};

export type TextAreaField = {
  kind: "textArea";
  id: number;
  label: string;
  fieldType: textFieldTypes;
  value: string;
};

export type RadioInputField = {
  kind: "radioInput";
  id: number;
  label: string;
  options: string[];
  value: string;
};

export type MultipleSelectField = {
  kind: "multipleSelect";
  id: number;
  label: string;
  options: string[];
  value: string;
};

export type formField =
  | TextField
  | DropdownField
  | TextAreaField
  | RadioInputField
  | MultipleSelectField;
