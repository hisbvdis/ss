// <Choice value=""/>
"use client";
import clsx from "clsx";
import { RequiredInput } from "@/app/_components/RequiredInput";
import { useId, useContext, useRef, ReactEventHandler } from "react";
import { ChoiceGroupContext } from "./ChoiceGroup";
import styles from "./Choice.module.css";

export const Checkbox = (props:Props) => <Choice type="checkbox" {...props}/>;
export const Radio = (props:Props) => <Choice type="radio" {...props}/>;

function Choice(props:Props) {
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
    <label className={clsx(styles["choice"], className)} style={style}>
      <input
        id={inputId}
        className={styles["choice__input"]}
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
      <span className={styles["choice__label"]}>{children}</span>
    </label>
  );
}

interface Props {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  valueToCompare: string;
  arrayToCompare: any[];
  checked: boolean;
  onChange: ReactEventHandler;
  required: boolean;
  disabled: boolean;
  className: string;
  style: React.CSSProperties;
  children: React.ReactNode;
  tabIndex: number;
}