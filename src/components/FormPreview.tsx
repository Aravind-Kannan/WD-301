import { Link, navigate } from "raviger";
import React, { useState, useEffect, useRef, useReducer } from "react";
import QuizInputContainer from "./QuizInputContainer";
import { formData } from "../interfaces/FormData";
import { getLocalForms, saveLocalForms } from "../Storage";
import { formField } from "../interfaces/FormField";
import QuizMultiInputContainer from "./QuizMultiInputContainer";

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

const initialFormFields: (id: number) => formField[] = (id: number) => {
  const localForms = getLocalForms();

  if (localForms.length > 0) {
    return localForms.filter((item) => item.id === id)[0].formFields;
  }

  const newForm = {
    id: Number(new Date()),
    title: "Untitled Form",
    formFields: initialFormFieldsList,
  };

  saveLocalForms([...localForms, newForm]);
  return newForm.formFields;
};

type clearAll = {
  type: "clear_all";
  formFields: formField[];
};

type updateValue = {
  type: "update_value";
  id: number;
  value: string;
  formFields: formField[];
};

type formFieldAction = clearAll | updateValue;

const formFieldReducer = (
  state: formField[],
  action: formFieldAction
): formField[] => {
  switch (action.type) {
    case "update_value": {
      return action.formFields.map((field: formField) => {
        if (field.id === action.id) return { ...field, value: action.value };
        return field;
      });
    }
    case "clear_all": {
      return action.formFields.map((field: formField) => {
        return { ...field, value: "" };
      });
    }
  }
};

type PreviousField = {
  type: "previous_field";
  fieldNumber: number;
};
type NextField = {
  type: "next_field";
  fieldNumber: number;
  length: number;
};

type FieldNumberAction = PreviousField | NextField;

const fieldNumberReducer = (
  state: number,
  action: FieldNumberAction
): number => {
  switch (action.type) {
    case "previous_field": {
      return action.fieldNumber > 0
        ? action.fieldNumber - 1
        : action.fieldNumber;
    }

    case "next_field": {
      return action.fieldNumber + 1 < action.length
        ? action.fieldNumber + 1
        : action.fieldNumber;
    }
  }
};

export function FormPreview(props: { id: number }) {
  const [state, setState] = useState(() => initialState(props.id));
  const [fieldNumber, dispatchFieldNumber] = useReducer(fieldNumberReducer, 0);
  const [formFields, dispatchFormFields] = useReducer(
    formFieldReducer,
    [] as formField[],
    () => initialFormFields(props.id)
  );
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

  // const updateValue = (id: number, value: string) => {
  //   setFormFields(
  //     formFields?.map((field) => {
  //       if (field.id === id) return { ...field, value: value };
  //       return field;
  //     })
  //   );
  // };

  // const clearAll = () => {
  //   setFormFields(
  //     state.formFields.map((field) => {
  //       return { ...field, value: "" };
  //     })
  //   );
  // };

  let field = state.formFields[fieldNumber];

  if (formFields.length !== 0) {
    let value = formFields ? formFields[fieldNumber].value : "";
    return (
      <div className="flex flex-col gap-2 p-4">
        <label className="my-2 flex-1 p-2 text-lg font-bold">
          {state.title}
        </label>
        <h3>
          {fieldNumber + 1} out of {state.formFields.length} Questions
        </h3>
        <div className="rounded-xl bg-gray-100 p-4">
          {((field: formField) => {
            if (field.kind === "text") {
              return (
                <QuizInputContainer
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  type={field.fieldType}
                  value={value}
                  updateValueCB={(id, value) =>
                    dispatchFormFields({
                      type: "update_value",
                      id,
                      value,
                      formFields,
                    })
                  }
                />
              );
            } else if (field.kind === "textArea") {
              return (
                <div>
                  <label>{field.label}</label>
                  <div className="flex">
                    <textarea
                      className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
                      value={value}
                      onChange={(e) => {
                        dispatchFormFields({
                          type: "update_value",
                          formFields: formFields,
                          id: field.id,
                          value: e.target.value,
                        });
                        // updateValue(field.id, e.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
              );
            } else if (
              field.kind === "dropdown" ||
              field.kind === "radioInput" ||
              field.kind === "multipleSelect"
            ) {
              return (
                <QuizMultiInputContainer
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  kind={field.kind}
                  options={field.options}
                  value={value}
                  updateValueCB={(id, value) =>
                    dispatchFormFields({
                      type: "update_value",
                      id,
                      value,
                      formFields,
                    })
                  }
                ></QuizMultiInputContainer>
              );
            }
          })(field)}
        </div>

        <div className="flex gap-1">
          {fieldNumber > 0 && (
            <button
              onClick={(_) =>
                dispatchFieldNumber({ type: "previous_field", fieldNumber })
              }
              className="my-2 w-full rounded-xl bg-orange-500 p-2 text-center text-white hover:bg-orange-700"
            >
              Previous
            </button>
          )}

          {fieldNumber < state.formFields.length - 1 && (
            <button
              onClick={(_) =>
                dispatchFieldNumber({
                  type: "next_field",
                  fieldNumber: fieldNumber,
                  length: state.formFields.length,
                })
              }
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
            onClick={(_) =>
              dispatchFormFields({ type: "clear_all", formFields })
            }
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
