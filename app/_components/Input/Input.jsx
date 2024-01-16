// <Input name={"name"} value={"state.name"} onChange={(e)=>e}/>
"use client";
import clsx from "clsx";
import { createElement, forwardRef, useContext, useEffect, useRef, useState } from "react";
import { ControlContext } from "@/app/_components/Control";
import "./Input.css";


export const Input = forwardRef(function Input(props, ref) {
  const dataFromControl = useContext(ControlContext);
  const [changed, setChanged] = useState(false);

  const name = props.name ?? "";
  const value = props.value ?? "";
  const required = props.required ?? dataFromControl?.required;
  const labelId = dataFromControl?.labelId;
  const inputRef = ref ?? useRef();
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
      className: clsx("input", type === "textarea" && "input--textarea", className),
      name: name,
      value: value,
      placeholder: placeholder,
      disabled: disabled,
      required: required,
      onChange: (e) => {onChange(e);onChangeValue(e.target.value);if(!changed)setChanged(true)},
      onBlur: (e) => {onBlur(e); if(changed)onBlurIfChanged(e); setChanged(false)},
      onFocus: (e) => {onFocus(e)},
      onKeyDown: (e) => {onKeyDown(e)},
      onClick: (e) => {onClick(e)},
      pattern: pattern,
      style: style,
      "aria-labelledby": labelId,
      ref: inputRef,
      readOnly: readOnly,
    }
  )
})

export const Textarea = (props) => <Input {...props} type="textarea"/>