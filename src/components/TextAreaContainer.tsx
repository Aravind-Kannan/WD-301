import React from "react";
import { fieldTypes, textFieldTypes } from "../interfaces/FormField";

export default function TextAreaContainer(props: {
  id: number;
  label: string;
  value: string;
  kind: fieldTypes;
  removeFieldCB: (id: number) => void;
  updateLabelCB: (id: number, label: string) => void;
  updateTypeCB: (id: number, type: textFieldTypes) => void;
  updateKindCB: (id: number, kind: fieldTypes) => void;
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
          value={props.kind}
          className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          onChange={(e) => {
            props.updateKindCB(props.id, e.target.value as fieldTypes);
          }}
        >
          <option value="text">Text</option>
          <option value="dropdown">Dropdown</option>
          <option value="textArea">Text Area</option>
          <option value="multipleSelect">Multi Select</option>
          <option value="radioInput">Radio Input</option>
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
