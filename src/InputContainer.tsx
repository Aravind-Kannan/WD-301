import React from "react";

export default function InputContainer(props: {
  id: number;
  label: string;
  value: string;
  type: string;
  removeFieldCB: (id: number) => void;
  updateValueCB: (id: number, value: string) => void;
}) {
  return (
    <>
      <label>{props.label}</label>
      <div className="flex">
        <input
          type={props.type}
          className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          value={props.value}
          onChange={(e) => {
            props.updateValueCB(props.id, e.target.value);
          }}
        />
        <button
          onClick={(_) => props.removeFieldCB(props.id)}
          className="m-1 rounded-xl bg-red-500 px-2 text-white hover:bg-red-700"
        >
          Remove
        </button>
      </div>
    </>
  );
}
