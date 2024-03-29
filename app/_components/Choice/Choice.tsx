// <Choice value=""/>
"use client";
import clsx from "clsx";
import { RequiredInput } from "@/app/_components/RequiredInput";
import { useId, useContext, useRef, ReactEventHandler, EventHandler, ChangeEvent } from "react";
import { ChoiceGroupContext } from "./ChoiceGroup";
import styles from "./styles.module.css";

export const Checkbox = (props:IProps) => <Choice {...props} type="checkbox"/>;
export const Radio = (props:IProps) => <Choice {...props} type="radio"/>;

function Choice(props:IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const choiceGroupContext = useContext(ChoiceGroupContext);

  const type = props.type;
  const name = props.name ?? choiceGroupContext?.name ?? "";
  const value = props.value ?? "";
  const valueToCompare = props.valueToCompare ?? choiceGroupContext?.valueToCompare ?? "";
  const arrayToCompare = props.arrayToCompare ?? choiceGroupContext?.arrayToCompare ?? [];
  const checked = props.checked ?? (valueToCompare ? value === valueToCompare : arrayToCompare.includes(value));
  const onChange = props.onChange ?? choiceGroupContext?.onChange ?? ((e:ChangeEvent)=>e);
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
        ref={inputRef}
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

interface IProps {
  type?: "radio" | "checkbox";
  value: string;
  name?: string;
  valueToCompare?: string;
  arrayToCompare?: any[];
  checked?: boolean;
  onChange?: ReactEventHandler;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  tabIndex?: number;
}