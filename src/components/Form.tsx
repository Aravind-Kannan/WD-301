import { Link, navigate } from "raviger";
import React, { useState, useEffect, useRef } from "react";
import InputContainer from "../InputContainer";
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

export function Form(props: { id: number }) {
  const [state, setState] = useState(() => initialState(props.id));
  const [newField, setNewField] = useState("");
  const [newFieldType, setNewFieldType] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    state.id !== props.id && navigate(`/forms/${props.id}`);
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
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  const addField = () => {
    setState({
      ...state,
      formFields: [
        ...state.formFields,
        {
          id: Number(new Date()),
          label: newField,
          type: newFieldType,
          value: "",
        },
      ],
    });
    setNewField("");
    setNewFieldType("");
  };

  const removeField = (id: number) => {
    setState({
      ...state,
      formFields: state.formFields.filter((field) => field.id !== id),
    });
  };

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

  return (
    <div className="flex flex-col gap-2 divide-y-2 divide-dotted p-4">
      <input
        placeholder="Title of Form"
        type="text"
        value={state.title}
        className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
        onChange={(e) => {
          setState({ ...state, title: e.target.value });
        }}
        ref={titleRef}
      />
      <div>
        {state.formFields.map((field) => (
          <InputContainer
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            value={field.value}
            removeFieldCB={removeField}
            updateValueCB={updateValue}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          placeholder="Form Field"
          type="text"
          value={newField}
          className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          onChange={(e) => {
            setNewField(e.target.value);
          }}
        />
        <input
          placeholder="Form Field Type"
          type="text"
          value={newFieldType}
          className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          onChange={(e) => {
            setNewFieldType(e.target.value);
          }}
        />
        <button
          onClick={addField}
          className="m-1 rounded-xl bg-blue-500 px-2 text-white hover:bg-blue-700"
        >
          Add Field
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={(_) => saveFormData(state)}
          className="my-2 w-1/4 rounded-xl bg-purple-500 p-2 text-center text-white hover:bg-purple-700"
        >
          Submit
        </button>
        <Link
          href="/"
          className="my-2 w-1/4 rounded-xl bg-red-500 p-2 text-center text-white hover:bg-red-700"
        >
          Close Form
        </Link>

        <button
          onClick={clearAll}
          className="my-2 w-1/4 rounded-xl bg-yellow-500 p-2 text-center text-white hover:bg-yellow-700"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
