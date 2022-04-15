import React from "react";
// import { MultiSelect } from "react-multi-select-component";
import { fieldTypes } from "../interfaces/FormField";

export default function QuizMultiInputContainer(props: {
  id: number;
  label: string;
  value: string;
  options: string[];
  kind: fieldTypes;
  updateValueCB: (id: number, value: string) => void;
}) {
  const updateCheckedField = (id: number, option: string) => {
    props.updateValueCB(id, option);
  };

  return (
    <>
      <label>{props.label}</label>
      <div className="flex">
        {(() => {
          if (props.kind === "dropdown") {
            return (
              <select
                className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
                value={props.value}
                onChange={(e) => {
                  props.updateValueCB(props.id, e.target.value);
                }}
              >
                <option value="">Select an option</option>
                {props.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            );
          } else if (props.kind === "radioInput") {
            return (
              <div>
                {props.options.map((option, index) => {
                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        checked={props.value === option}
                        onChange={(e) => {
                          updateCheckedField(props.id, option);
                        }}
                      />
                      <span className="px-2">{option}</span>
                      <br />
                    </label>
                  );
                })}
              </div>
            );
          } else if (props.kind === "multipleSelect") {
            return (
              <div>
                {/* <MultiSelect
                  className=""
                  options={selectOptions}
                  value={selected}
                  onChange={setSelected}
                  labelledBy="Select"
                /> */}
                <button
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${props.id}`}
                  aria-expanded="false"
                  aria-controls={`collapse${props.id}`}
                  className="w-full rounded-t-lg bg-white p-2"
                >
                  <div className="float-left pl-2" id="Multi">
                    {props.value.length === 0
                      ? "--- Select options ---"
                      : props.value}
                  </div>
                  <div className="float-right pr-2 text-gray-500">
                    <i className="fa-solid fa-angle-down"></i>
                  </div>
                </button>
                <div
                  className="collapse rounded-b-lg bg-white p-2"
                  id={`collapse${props.id}`}
                >
                  {props.options.map((opt, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        id={`${opt}${index}`}
                        name={props.label}
                        value={opt}
                        className=""
                        checked={props.value.split(",").indexOf(opt) !== -1}
                        onChange={(e) => {
                          let value = e.target.value;
                          let elem = document.getElementById("Multi");

                          if (elem) {
                            let valArray = elem.innerHTML.split(",");

                            let removeElementFromArray = (element: string) => {
                              if (valArray.includes(element))
                                valArray.splice(valArray.indexOf(element), 1);
                            };

                            removeElementFromArray("");
                            removeElementFromArray("--- Select options ---");

                            valArray.includes(value)
                              ? removeElementFromArray(value)
                              : valArray.push(value);

                            elem.innerHTML = valArray.join(",");
                            updateCheckedField(props.id, elem.innerHTML);
                          }
                        }}
                      />
                      <label className="ml-2" htmlFor={`${opt}${index}`}>
                        {opt}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        })()}
      </div>
    </>
  );
}
