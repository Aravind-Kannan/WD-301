import React from "react";

export default function InputContainer(props: {
  id: number;
  label: string;
  type: string;
}) {
  return (
    <div key={props.id}>
      <label>{props.label}</label>
      <input
        type={props.type}
        className="my-2 w-full rounded-lg border-2 border-gray-200 p-2"
      />
    </div>
  );
}
