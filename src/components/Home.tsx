import React from "react";
import logo from "../logo.svg";

export function Home(props: { openFormCB: () => void }) {
  return (
    <div>
      <div className="flex ">
        <img className="h-48" src={logo} />
        <div className="flex flex-1 items-center justify-center">
          <p>Welcome to the Home page!</p>
        </div>
      </div>
      <button
        onClick={props.openFormCB}
        className="w-full rounded-xl bg-green-500 p-2 text-white hover:bg-green-700"
      >
        Open Form
      </button>
    </div>
  );
}
