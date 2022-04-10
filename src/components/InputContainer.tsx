import React from "react";
import { textFieldTypes } from "../interfaces/FormField";

export default function InputContainer(props: {
  id: number;
  label: string;
  value: string;
  type: string;
  removeFieldCB: (id: number) => void;
  updateLabelCB: (id: number, label: string) => void;
  updateTypeCB: (id: number, type: textFieldTypes) => void;
}) {
  return (
    <>
      <div className="flex gap-2">
        <input
          name="label"
          placeholder="Form Field"
          type="text"
          value={props.label}
          className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          onChange={(e) => {
            props.updateLabelCB(props.id, e.target.value);
          }}
        />
        <select
          value={props.type}
          className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 bg-gray-200 p-2"
          onChange={(e) => {
            props.updateTypeCB(props.id, e.target.value as textFieldTypes);
          }}
        >
          <option value="text">Text</option>
          <option value="date">Date</option>
          <option value="email">Email</option>
        </select>
        <button
          onClick={(_) => props.removeFieldCB(props.id)}
          className="my-2 rounded-xl bg-red-500 p-2 text-white hover:bg-red-700"
        >
          Remove
        </button>
      </div>
    </>
  );
}
