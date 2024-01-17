// <Choice value=""/>
"use client";
import clsx from "clsx";
import { RequiredInput } from "@/app/_components/RequiredInput";
import { useId, useContext, useRef } from "react";
import { ChoiceGroupContext } from "./ChoiceGroup";
import "./Choice.css";

function Choice(props) {
  const ref = useRef();
  const inputId = useId();
  const choiceGroupContext = useContext(ChoiceGroupContext);

  const type = props.type;
  const name = props.name ?? choiceGroupContext?.name ?? "";
  const value = props.value ?? "";
  const valueToCompare = props.valueToCompare ?? choiceGroupContext?.valueToCompare ?? "";
  const arrayToCompare = props.arrayToCompare ?? choiceGroupContext?.arrayToCompare ?? [];
  const checked = props.checked ?? (valueToCompare ? value === valueToCompare : arrayToCompare.includes(value));
  const onChange = props.onChange ?? choiceGroupContext?.onChange ?? ((e)=>e);
  const required = props.required ?? false;
  const requiredGroup = choiceGroupContext?.requiredGroup ?? false;
  const disabled = props.disabled ?? choiceGroupContext?.disabledGroup ?? false;
  const { className, style, children } = props;
  const { tabIndex=0 } = props;

  return (
    <label className={clsx("choice", className)} style={style}>
      <input
        id={inputId}
        className="choice__input"
        type={type}
        ref={ref}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required={required}
        tabIndex={tabIndex}
        disabled={disabled}
      />
      {requiredGroup && type === "checkbox" ? <RequiredInput name={name} checked={checked} required={required}/> : ""}
      <span className="choice__label">{children}</span>
    </label>
  );
}

export const Checkbox = (props) => <Choice type="checkbox" {...props}/>;
export const Radio = (props) => <Choice type="radio" {...props}/>;