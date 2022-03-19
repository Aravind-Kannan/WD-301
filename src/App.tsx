import React from "react";
import Header from "./Header";
import AppContainer from "./AppContainer";
import InputContainer from "./InputContainer";

const formFields = [
  { id: 1, label: "First Name", type: "text" },
  { id: 2, label: "Last Name", type: "text" },
  { id: 3, label: "Email", type: "email" },
  { id: 4, label: "Date of Birth", type: "date" },
  { id: 4, label: "Phone Number", type: "tel" },
];

function App() {
  return (
    <AppContainer>
      <div className="mx-auto rounded-xl bg-white p-4 shadow-lg">
        <Header title="Welcome to Lesson 5 of $react-typescript with #tailwindcss" />
        {formFields.map((field) => (
          <InputContainer id={field.id} label={field.label} type={field.type} />
        ))}
        <button
          className="w-full rounded-xl bg-purple-500 p-2 text-white"
          type="submit"
        >
          Submit
        </button>
      </div>
    </AppContainer>
  );
}

export default App;
