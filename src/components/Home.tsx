import React, { useState, useEffect } from "react";
import { getLocalForms, saveLocalForms } from "../Storage";

export function Home(props: { openFormCB: (id: number) => void }) {
  const [state, setState] = useState(() => getLocalForms());

  useEffect(() => {
    let timeout = setTimeout(() => {
      saveLocalForms(state);
      console.log("state saved to localStorage");
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  const addForm = () => {
    setState(() => [
      ...state,
      {
        id: Number(new Date()),
        title: "Untitled Form",
        formFields: [],
      },
    ]);
  };

  const removeForm = (id: number) => {
    setState(state.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col">
        {state.map((item) => {
          return (
            <div key={item.id} className="flex flex-row items-center">
              <div className="flex-1">{item.title}</div>
              <button
                onClick={(_) => props.openFormCB(item.id)}
                className="m-2 rounded-xl bg-blue-500 p-2 text-white hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={(_) => removeForm(item.id)}
                className="m-2 rounded-xl bg-red-500 p-2 text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={addForm}
        className="w-full rounded-xl bg-green-500 p-2 text-white hover:bg-green-700"
      >
        New Form
      </button>
    </div>
  );
}
