import { navigate } from "raviger";
import React, { useState } from "react";
import { json } from "stream/consumers";
import { Errors, form, validateForm } from "../interfaces/FormData";

export default function CreateForm() {
  const [form, setForm] = useState<form>({
    title: "",
    description: "",
    is_public: false,
  });

  const [errors, setErrors] = useState<Errors<form>>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submit!");
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Basic Auth Credentials
      const auth = "Basic " + window.btoa("gigin:7zQ7efBJRHCWyu");
      const response = await fetch("https://tsapi.gigin.dev/api/forms/", {
        method: "POST",
        headers: {
          "Content Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        navigate(`/forms/${data.id}`);
      }
    }
  };

  return (
    <div className="w-full divide-y divide-gray-200">
      <h1 className="my-2 text-xl text-slate-700">Create Form</h1>
      <form className="py-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className={`${errors.title ? "text-red-500" : ""}`}
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
            }}
            className="smooth-effect mt-1 w-full flex-1 rounded-lg border-2 border-gray-300 p-2 hover:border-blue-400 hover:ring-blue-400 focus:border-blue-400 focus:ring-blue-400"
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className={`${errors.description ? "text-red-500" : ""}`}
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={form.description}
            onChange={(e) => {
              setForm({ ...form, description: e.target.value });
            }}
            className="smooth-effect mt-1 w-full flex-1 rounded-lg border-2 border-gray-300 p-2 hover:border-blue-400 hover:ring-blue-400 focus:border-blue-400 focus:ring-blue-400"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="mb-4 flex w-fit">
          <label
            htmlFor="is_public"
            className={`${errors.is_public ? "text-red-500" : ""}`}
          >
            Is Public
          </label>
          <input
            type="checkbox"
            name="is_public"
            id="is_public"
            value={form.is_public ? "true" : "false"}
            onChange={(e) => {
              setForm({ ...form, is_public: e.target.checked });
            }}
            className="smooth-effect ml-3 mt-1 flex-1 rounded-lg border-2 border-gray-300 p-2 hover:border-blue-400 hover:ring-blue-400 focus:border-blue-400 focus:ring-blue-400"
          />
          {errors.is_public && (
            <p className="text-red-500">{errors.is_public}</p>
          )}
        </div>

        <button
          className="font-worksans smooth-effect w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-700"
          type="submit"
        >
          Add Form
        </button>
      </form>
    </div>
  );
}
