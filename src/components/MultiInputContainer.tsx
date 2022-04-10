import React, { useState } from "react";
import { fieldTypes } from "../interfaces/FormField";

export default function MultiInputContainer(props: {
  id: number;
  label: string;
  options: string[];
  kind: string;
  removeFieldCB: (id: number) => void;
  updateLabelCB: (id: number, label: string) => void;
  updateKindCB: (id: number, kind: fieldTypes) => void;
  updateOptionCB: (id: number, index: number, value: string) => void;
  removeOptionCB: (id: number, index: number) => void;
}) {
  const [newFieldValue, setNewFieldValue] = useState("");
  const addFieldValue = (id: number) => {
    props.updateOptionCB(id, props.options.length, newFieldValue);
    setNewFieldValue("");
  };

  const removeFieldValue = (id: number, index: number) => {
    props.removeOptionCB(id, index);
  };

  return (
    <div className="my-2 rounded-lg bg-slate-100 p-4">
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

      <div className="rounded-lg bg-slate-200 p-2">
        <h3>"{props.kind.toLowerCase()}" Editor</h3>
        {props.options.map((option, index) => (
          <div key={index} className="flex">
            <input
              name="type"
              type="text"
              value={option}
              className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
              onChange={(e) => {
                props.updateOptionCB(props.id, index, e.target.value);
              }}
            />
            <button
              onClick={(e) => {
                removeFieldValue(props.id, index);
              }}
              className="m-1 rounded-xl bg-red-500 px-2 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
        <div className="flex">
          <input
            placeholder="Form Field Value"
            value={newFieldValue}
            className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
            onChange={(e) => {
              setNewFieldValue(e.target.value);
            }}
          />
          <button
            onClick={(e) => {
              addFieldValue(props.id);
            }}
            className="m-1 rounded-xl bg-blue-500 px-2 text-white hover:bg-blue-700"
          >
            Add Value
          </button>
        </div>
      </div>
      {/* <select
        className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
        value={props.field.value}
      >
        <option value="">Select an option</option>
        {props.field.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select> */}
    </div>
  );
}
