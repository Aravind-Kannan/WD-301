import React, { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
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

  // console.log("Value:", props.value);
  // console.log("Array:", props.value.split(","));

  const [selected, setSelected] = useState(() => {
    if (props.value.split(",").length > 0) {
      return props.value
        .split(",")
        .filter((option) => option.length > 0)
        .map((option) => {
          return { value: option, label: option };
        });
    } else {
      return [];
    }
  });

  // const [selected, setSelected] = useState([]);
  console.log("Selected:", selected);

  useEffect(() => {
    let timeout = setTimeout(() => {
      let selectedStrings = selected.map((item) => item["value"]);
      console.log("Sending:", selectedStrings.join(","));
      props.updateValueCB(props.id, selectedStrings.join(","));
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [selected, props]);

  return (
    <>
      <label>{props.label}</label>
      <div className="flex">
        {(() => {
          const selectOptions = props.options.map((option) => ({
            value: option,
            label: option,
          }));
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
                <MultiSelect
                  className=""
                  options={selectOptions}
                  value={selected}
                  onChange={setSelected}
                  labelledBy="Select"
                />
              </div>
            );
          }
        })()}
      </div>
    </>
  );
}
