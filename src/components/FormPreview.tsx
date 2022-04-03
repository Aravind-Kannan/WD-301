import { Link, navigate } from "raviger";
import React, { useState, useEffect, useRef } from "react";
import QuizInputContainer from "./QuizInputContainer";
import { formData } from "../interfaces/FormData";
import { getLocalForms, saveLocalForms } from "../Storage";

const initialState: (id: number) => formData = (id: number) => {
  const localForms = getLocalForms();

  if (localForms.length > 0) {
    return localForms.filter((item) => item.id === id)[0];
  }

  const newForm = {
    id: Number(new Date()),
    title: "Untitled Form",
    formFields: [],
  };

  saveLocalForms([...localForms, newForm]);
  return newForm;
};

const saveFormData = (currentState: formData) => {
  const localForms = getLocalForms();
  const updatedLocalForms = localForms.map((form) =>
    form.id === currentState.id ? currentState : form
  );
  saveLocalForms(updatedLocalForms);
};

export function FormPreview(props: { id: number }) {
  const [state, setState] = useState(() => initialState(props.id));
  const [fieldNumber, setFieldNumber] = useState(0);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    state.id !== props.id && navigate(`/preview/${props.id}`);
  }, [state.id, props.id]);

  useEffect(() => {
    console.log("Component Mounted!");
    document.title = "Form Editor";
    titleRef.current?.focus();
    return () => {
      document.title = "React App";
    };
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      saveFormData(state);
      console.log("state saved to localStorage");
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  // mark for removal
  const updateValue = (id: number, value: string) => {
    setState({
      ...state,
      formFields: state.formFields.map((field) => {
        if (field.id === id) return { ...field, value: value };
        return field;
      }),
    });
  };

  const clearAll = () => {
    setState({
      ...state,
      formFields: state.formFields.map((field) => {
        return { ...field, value: "" };
      }),
    });
  };

  const previousFieldNumber = () => {
    if (fieldNumber > 0) {
      setFieldNumber(fieldNumber - 1);
    }
  };
  const nextFieldNumber = () => {
    if (fieldNumber + 1 < state.formFields.length) {
      setFieldNumber(fieldNumber + 1);
    }
  };

  let field = state.formFields[fieldNumber];

  if (state.formFields.length !== 0) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <label className="my-2 flex-1 p-2 text-lg font-bold">
          {state.title}
        </label>
        <h3>
          {fieldNumber + 1} out of {state.formFields.length} Questions
        </h3>
        <div className="rounded-xl bg-gray-100 p-4">
          {
            <QuizInputContainer
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              value={field.value}
              updateValueCB={updateValue}
            />
          }
        </div>

        <div className="flex gap-1">
          {fieldNumber > 0 && (
            <button
              onClick={(_) => previousFieldNumber()}
              className="my-2 w-full rounded-xl bg-orange-500 p-2 text-center text-white hover:bg-orange-700"
            >
              Previous
            </button>
          )}

          {fieldNumber < state.formFields.length - 1 && (
            <button
              onClick={(_) => nextFieldNumber()}
              className="my-2 w-full rounded-xl bg-orange-500 p-2 text-center text-white hover:bg-orange-700"
            >
              Next
            </button>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={(_) => saveFormData(state)}
            className="my-2  rounded-xl bg-purple-500 p-2 text-center text-white hover:bg-purple-700"
          >
            Submit
          </button>
          <Link
            href="/"
            className="my-2  rounded-xl bg-red-500 p-2 text-center text-white hover:bg-red-700"
          >
            Close Form
          </Link>

          <button
            onClick={clearAll}
            className="my-2  rounded-xl bg-yellow-500 p-2 text-center text-white hover:bg-yellow-700"
          >
            Clear All
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-2 p-4">
        <label className="my-2 flex-1 p-2 text-lg font-bold">
          {state.title}
        </label>
        <h3 className="rounded-lg bg-gray-200 p-4">
          Form has no fields created! 😬
        </h3>
        <Link
          href="/"
          className="my-2  rounded-xl bg-red-500 p-2 text-center text-white hover:bg-red-700"
        >
          Close Form
        </Link>
      </div>
    );
  }
}
