import { Link, navigate } from "raviger";
import React, { useState, useEffect, useRef, useReducer } from "react";
import InputContainer from "./InputContainer";
import { formData } from "../interfaces/FormData";
import { getLocalForms, saveLocalForms } from "../Storage";
import { fieldTypes, formField, textFieldTypes } from "../interfaces/FormField";
import MultiInputContainer from "./MultiInputContainer";
import TextAreaContainer from "./TextAreaContainer";

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

type AddAction = {
  type: "add_field";
  label: string;
  kind: fieldTypes;
  callback: () => void;
};

type RemoveAction = {
  type: "remove_field";
  id: number;
};

type UpdateTitleAction = {
  type: "update_title";
  title: string;
};

type UpdateOptionAction = {
  type: "update_option";
  optionId: number;
  fieldId: number;
  value: string;
};

type RemoveOptionAction = {
  type: "remove_option";
  optionId: number;
  fieldId: number;
};

type UpdateLabelAction = {
  type: "update_label";
  id: number;
  label: string;
};

type UpdateKindAction = {
  type: "update_kind";
  id: number;
  kind: fieldTypes;
};

type UpdateTypeAction = {
  type: "update_type";
  id: number;
  textKind: textFieldTypes;
};

type FormAction =
  | AddAction
  | RemoveAction
  | UpdateTitleAction
  | UpdateOptionAction
  | RemoveOptionAction
  | UpdateLabelAction
  | UpdateKindAction
  | UpdateTypeAction;

const reducer = (state: formData, action: FormAction): formData => {
  switch (action.type) {
    case "add_field": {
      let newField = action.label;
      let newFieldType = action.kind;

      if (newField.length > 0) {
        action.callback();
        if (newFieldType === "text") {
          return {
            ...state,
            formFields: [
              ...state.formFields,
              {
                kind: "text",
                id: Number(new Date()),
                label: newField,
                fieldType: "text",
                value: "",
              },
            ],
          };
        } else if (newFieldType === "textArea") {
          return {
            ...state,
            formFields: [
              ...state.formFields,
              {
                kind: "textArea",
                id: Number(new Date()),
                label: newField,
                value: "",
                fieldType: "text",
              },
            ],
          };
        } else if (
          newFieldType === "radioInput" ||
          newFieldType === "multipleSelect" ||
          newFieldType === "dropdown"
        ) {
          return {
            ...state,
            formFields: [
              ...state.formFields,
              {
                kind: newFieldType,
                id: Number(new Date()),
                label: newField,
                value: "",
                options: [],
              },
            ],
          };
        }
      }
      return state;
    }

    case "remove_field": {
      return {
        ...state,
        formFields: state.formFields.filter((field) => field.id !== action.id),
      };
    }

    case "update_title": {
      return {
        ...state,
        title: action.title,
      };
    }

    case "update_option": {
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (
            field.id === action.fieldId &&
            (field.kind === "dropdown" ||
              field.kind === "multipleSelect" ||
              field.kind === "radioInput")
          ) {
            if (action.optionId < field.options.length) {
              field.options[action.optionId] = action.value;
            } else {
              field.options.push(action.value);
            }
            return field;
          }
          return field;
        }),
      };
    }

    case "remove_option": {
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (
            field.id === action.fieldId &&
            (field.kind === "dropdown" ||
              field.kind === "multipleSelect" ||
              field.kind === "radioInput")
          ) {
            field.options.splice(action.optionId, 1);
          }
          return field;
        }),
      };
    }

    case "update_label": {
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id) return { ...field, label: action.label };
          return field;
        }),
      };
    }

    case "update_kind": {
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id) {
            field.kind = action.kind;
          }
          return field;
        }),
      };
    }

    case "update_type": {
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id && field.kind === "text") {
            field.fieldType = action.textKind;
          }
          return field;
        }),
      };
    }
  }
};

type ChangeText = {
  type: "change_text";
  value: string;
};

type ClearText = {
  type: "clear_text";
};

type newFieldAction = ChangeText | ClearText;
const newFieldReducer = (state: string, action: newFieldAction) => {
  switch (action.type) {
    case "change_text": {
      return action.value;
    }
    case "clear_text":
      return "";
  }
};

export function Form(props: { id: number }) {
  const [state, dispatch] = useReducer(reducer, null, () =>
    initialState(props.id)
  );
  const [newField, dispatchNewField] = useReducer(newFieldReducer, "");
  const [newFieldType, setNewFieldType] = useState<fieldTypes>("text");
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

  // const dispatchAction = (action: FormAction) => {
  //   setState((prevState) => {
  //     return reducer(prevState, action);
  //   });
  // };

  return (
    <div className="flex flex-col gap-2 divide-y-2 divide-dotted p-4">
      <input
        placeholder="Title of Form"
        type="text"
        value={state.title}
        className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
        onChange={(e) => {
          dispatch({ type: "update_title", title: e.target.value });
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
                  removeFieldCB={(id) =>
                    dispatch({ type: "remove_field", id: id })
                  }
                  updateLabelCB={(id, label) => {
                    dispatch({ type: "update_label", id, label });
                  }}
                  updateTypeCB={(id, textKind) => {
                    dispatch({
                      type: "update_type",
                      id,
                      textKind,
                    });
                  }}
                />
              );
            case "textArea":
              return (
                <TextAreaContainer
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  value={field.value}
                  kind={field.kind}
                  updateKindCB={(id, kind) => {
                    dispatch({ type: "update_kind", id, kind });
                  }}
                  removeFieldCB={(id) =>
                    dispatch({ type: "remove_field", id: id })
                  }
                  updateLabelCB={(id, label) => {
                    dispatch({ type: "update_label", id, label });
                  }}
                  updateTypeCB={(id, textKind) => {
                    dispatch({
                      type: "update_type",
                      id,
                      textKind,
                    });
                  }}
                />
              );
            case "dropdown":
            case "multipleSelect":
            case "radioInput":
              return (
                <MultiInputContainer
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  kind={field.kind}
                  options={field.options}
                  removeFieldCB={(id) =>
                    dispatch({ type: "remove_field", id: id })
                  }
                  updateLabelCB={(id, label) => {
                    dispatch({ type: "update_label", id, label });
                  }}
                  updateKindCB={(id, kind) => {
                    dispatch({ type: "update_kind", id, kind });
                  }}
                  updateOptionCB={(fieldId, optionId, value) => {
                    dispatch({
                      type: "update_option",
                      optionId,
                      fieldId,
                      value,
                    });
                  }}
                  removeOptionCB={(optionId, fieldId) => {
                    dispatch({
                      type: "remove_option",
                      optionId,
                      fieldId,
                    });
                  }}
                ></MultiInputContainer>
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
            dispatchNewField({ type: "change_text", value: e.target.value });
          }}
        />
        <select
          value={newFieldType}
          className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          onChange={(e) => {
            setNewFieldType(e.target.value as fieldTypes);
          }}
        >
          <option value="text">Text</option>
          <option value="dropdown">Dropdown</option>
          <option value="textArea">Text Area</option>
          <option value="multipleSelect">Multi Select</option>
          <option value="radioInput">Radio Input</option>
        </select>
        <button
          onClick={(_) =>
            dispatch({
              type: "add_field",
              label: newField,
              kind: newFieldType,
              callback: () => {
                dispatchNewField({ type: "clear_text" });
              },
            })
          }
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
