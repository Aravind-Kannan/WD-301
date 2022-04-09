// export type formField = {
//   id: number;
//   label: string;
//   type: string;
//   value: string;
// };

type textFieldTypes = "text" | "email" | "date";

type TextField = {
  kind: "text";
  id: number;
  label: string;
  fieldType: textFieldTypes;
  value: string;
};

type DropdownField = {
  kind: "dropdown";
  id: number;
  label: string;
  options: string[];
  value: string;
};

export type formField = TextField | DropdownField;
