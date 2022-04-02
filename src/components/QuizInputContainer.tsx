import React from "react";

export default function QuizInputContainer(props: {
  id: number;
  label: string;
  value: string;
  type: string;
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
      </div>
    </>
  );
}
