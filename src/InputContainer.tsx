import React from "react";

export default function InputContainer(props: {
  id: number;
  label: string;
  type: string;
  removeFieldCB: (id: number) => void;
}) {
  return (
    <>
      <label>{props.label}</label>
      <div className="flex">
        <input
          type={props.type}
          className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
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
