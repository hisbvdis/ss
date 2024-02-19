// <Input name={"name"} value={"state.name"} onChange={(e)=>e}/>
"use client";
import clsx from "clsx";
import { ChangeEvent, createElement, forwardRef, useContext, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import { ControlContext } from "@/app/_components/Control";
import styles from "./Input.module.css";


export const Input = forwardRef<HTMLInputElement, Props>(function Input(props, forwardedRef:any) {
  const dataFromControl = useContext(ControlContext);
  const [changed, setChanged] = useState(false);

  const name = props.name ?? "";
  const value = props.value ?? "";
  const required = props.required ?? dataFromControl?.required;
  const labelId = dataFromControl?.labelId;
  const inputRef = forwardedRef ?? useRef(null);
  const id = props.id ?? dataFromControl?.inputId;
  const { onChange=(e=>e), onChangeValue=(e=>e) } = props;
  const { onFocus=(e=>e), onBlur=(e=>e), onBlurIfChanged=(e=>e) } = props;
  const { onClick=(e=>e), onKeyDown=(e=>e) } = props;
  const { type="text", placeholder, disabled, pattern, readOnly } = props;
  const { className, style } = props;

  useEffect(() => {
    if (type !== "textarea") return;
    inputRef.current.style.height = "5px";
    inputRef.current.style.height = inputRef.current.scrollHeight + 2 + "px";
  }, [value]);

  return createElement(
    type === "textarea" ? "textarea" : "input",
    {
      type: type,
      id: id,
      className: clsx(styles["input"], type === "textarea" && styles["input--textarea"], className),
      name: name,
      value: value,
      placeholder: placeholder,
      disabled: disabled,
      required: required,
      onChange: (e:ChangeEvent<HTMLInputElement>) => {onChange(e);onChangeValue(e.target.value);if(!changed)setChanged(true)},
      onBlur: (e:FocusEvent) => {onBlur(e); if(changed)onBlurIfChanged(e); setChanged(false)},
      onFocus: (e:FocusEvent) => {onFocus(e)},
      onKeyDown: (e:KeyboardEvent) => {onKeyDown(e)},
      onClick: (e:MouseEvent) => {onClick(e)},
      pattern: pattern,
      style: style,
      "aria-labelledby": labelId,
      ref: inputRef,
      readOnly: readOnly,
    }
  )
})

export const Textarea = (props:Props) => <Input {...props} type="textarea"/>

interface Props {
  name?: string;
  value?: string;
  required?: boolean;
  id?: string;
  type?: "text" | "textarea";
  placeholder?: string;
  disabled?: boolean;
  pattern?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => ChangeEvent;
  onChangeValue?: (value:string) => string;
  onBlur?: (e: FocusEvent) => FocusEvent;
  onFocus?: (e: FocusEvent) => FocusEvent;
  onBlurIfChanged?: (e: FocusEvent) => FocusEvent;
  onClick?: (e:MouseEvent) => MouseEvent;
  onKeyDown?: (e:KeyboardEvent) => KeyboardEvent;
}