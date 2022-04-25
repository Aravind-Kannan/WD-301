import React, { useState, useEffect } from "react";
import { getLocalForms, saveLocalForms } from "../Storage";
import { Link, useQueryParams } from "raviger";
import { formField } from "../interfaces/FormField";
import { form, formData } from "../interfaces/FormData";
import Modal from "../common/Modal";
import CreateForm from "./CreateForm";

const initialFormFieldsList: formField[] = [
  {
    kind: "text",
    id: 1,
    label: "Name",
    value: "",
    fieldType: "text",
  },
  {
    kind: "textArea",
    id: 2,
    label: "College Address",
    value: "",
    fieldType: "text",
  },
  {
    kind: "multipleSelect",
    id: 3,
    label: "Colors",
    options: ["Red", "Blue", "Green"],
    value: "",
  },
  {
    kind: "radioInput",
    id: 4,
    label: "Gender",
    options: ["Male", "Female"],
    value: "",
  },
];

const fetchForms = async (setStateCB: (value: form[]) => void) => {
  const response = await fetch("https://tsapi.gigin.dev/api/mock_test/");
  const jsonData = await response.json();
  setStateCB(jsonData);
};

export function Home() {
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");

  const [state, setState] = useState<form[]>(() => getLocalForms());
  const [newForm, setNewForm] = useState(false);

  useEffect(() => {
    let timeout = setTimeout(() => {
      saveLocalForms(state);
      console.log("state saved to localStorage");
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  useEffect(() => {
    fetchForms(setState);
  }, []);

  // const addForm = () => {
  //   setState(() => [
  //     ...state,
  //     {
  //       id: Number(new Date()),
  //       title: "Untitled Form",
  //       formFields: initialFormFieldsList,
  //     },
  //   ]);
  // };

  const removeForm = (id: number) => {
    setState(state.filter((item) => item.id !== id));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery({ search: searchString });
        }}
      >
        <input
          placeholder="Search"
          name="search"
          type="text"
          value={searchString}
          className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
        />
      </form>
      <div className="flex flex-col">
        {state
          .filter((form) => {
            return form.title
              .toLowerCase()
              .includes(search?.toLowerCase() || "");
          })
          .map((item) => {
            return (
              <div
                key={item.id}
                className="m-2 flex flex-row items-center rounded-xl bg-gray-100 p-2"
              >
                <div className="flex w-full flex-col">
                  <div className="flex-1">{item.title}</div>
                  <div className="text-gray-500">
                    {/* {item.formFields.length} Questions */}
                  </div>
                </div>
                <Link
                  href={`/forms/${item.id}`}
                  className="m-2 rounded-xl bg-blue-500 p-2 text-white hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={(_) =>
                    // try to overcome
                    removeForm(item.id === undefined ? 0 : item.id)
                  }
                  className="m-2 rounded-xl bg-red-500 p-2 text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            );
          })}
      </div>

      <button
        onClick={(_) => setNewForm(true)}
        className="w-full rounded-xl bg-green-500 p-2 text-white hover:bg-green-700"
      >
        New Form
      </button>
      <Modal open={newForm} closeCB={() => setNewForm(false)}>
        <CreateForm />
      </Modal>
    </div>
  );
}
