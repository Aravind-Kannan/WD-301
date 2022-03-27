import React, { useState } from "react";
import Header from "./Header";
import AppContainer from "./AppContainer";
import { Home } from "./components/Home";
import { Form } from "./components/Form";

function App() {
  const [state, setState] = useState<string>("HOME");
  const [formId, setFormId] = useState(0);

  const openForm = (id: number) => {
    setFormId(id);
    setState("FORM");
  };

  const closeForm = () => {
    setState("HOME");
  };

  return (
    <AppContainer>
      <div className=" mx-auto rounded-xl bg-white p-4 shadow-lg">
        <Header title="Form Builder" />
        {state === "HOME" ? (
          <Home openFormCB={openForm} />
        ) : (
          <Form id={formId} closeFormCB={closeForm} />
        )}
      </div>
    </AppContainer>
  );
}

export default App;
