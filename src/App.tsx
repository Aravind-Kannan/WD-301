import React from "react";
import Header from "./Header";
import AppContainer from "./AppContainer";

const formFields = [
  { id: 1, label: "First Name" },
  { id: 2, label: "Last Name" },
  { id: 3, label: "Email" },
];

function App() {
  return (
    <AppContainer>
      <div className="mx-auto rounded-xl bg-white p-4 shadow-lg">
        <Header title="Welcome to Lesson 5 of $react-typescript with #tailwindcss" />
        {formFields.map((field) => (
          <React.Fragment key={field.id}>
            <label>{field.label}</label>
            <input
              type="text"
              className="m-2 w-full rounded-lg border-2 border-gray-200 p-2"
            />
          </React.Fragment>
        ))}
      </div>
    </AppContainer>
  );
}

export default App;
