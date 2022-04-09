import { Link, navigate } from "raviger";
import React, { useState, useEffect, useRef } from "react";
import InputContainer from "./InputContainer";
import { formData } from "../interfaces/FormData";
import { getLocalForms, saveLocalForms } from "../Storage";
import { formField } from "../interfaces/FormField";

const initialFormFieldsList: formField[] = [
  {
    kind: "dropdown",
    id: 1,
    label: "Priority",
    options: ["Low", "High"],
    value: "",
  },
];

const initialState: (id: number) => formData = (id: number) => {
  const localForms = getLocalForms();

  if (localForms.length > 0) {
    return localForms.filter((item) => item.id === id)[0];
  }

  const newForm = {
    id: Number(new Date()),
    title: "Untitled Form",
    formFields: initialFormFieldsList,
  };

  console.log(newForm);

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
    }, 500);

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
          kind: "text",
          id: Number(new Date()),
          label: newField,
          fieldType:
            newFieldType === "email" || newFieldType === "date"
              ? newFieldType
              : "text",
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

  const updateLabel = (id: number, label: string) => {
    setState({
      ...state,
      formFields: state.formFields.map((field) => {
        if (field.id === id) return { ...field, label: label };
        return field;
      }),
    });
  };

  const updateType = (id: number, type: string) => {
    setState({
      ...state,
      formFields: state.formFields.map((field) => {
        if (field.id === id) return { ...field, type: type };
        return field;
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
        {state.formFields.map((field) => {
          switch (field.kind) {
            case "text":
              return (
                <InputContainer
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  type={field.fieldType}
                  value={field.value}
                  removeFieldCB={removeField}
                  updateLabelCB={updateLabel}
                  updateTypeCB={updateType}
                />
              );
            case "dropdown":
              return (
                <select
                  className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
                  value={field.value}
                  onChange={(e) => {
                    updateLabel(field.id, e.target.value);
                  }}
                >
                  <option value="">Select an option</option>
                  {field.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
          }
        })}
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

      <div className="flex gap-1">
        <button
          onClick={(_) => saveFormData(state)}
          className="my-2 w-full rounded-xl bg-purple-500 p-2 text-center text-white hover:bg-purple-700"
        >
          Save Form
        </button>
        <Link
          href="/"
          className="my-2 w-full rounded-xl bg-red-500 p-2 text-center text-white hover:bg-red-700"
        >
          Close Form
        </Link>
        <Link
          href={`/preview/${props.id}`}
          className="my-2 w-full rounded-xl bg-green-500 p-2 text-center text-white hover:bg-green-700"
        >
          Preview
        </Link>
      </div>
    </div>
  );
}
