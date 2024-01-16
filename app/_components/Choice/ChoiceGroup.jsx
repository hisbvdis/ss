// <ChoiceGroup name="name" valueToCompare={""} arrayToCompare={[]} onChange={(e)=>e}>
"use client";
import clsx from "clsx";
import { createContext, useContext, useId, useRef } from 'react';
// -----------------------------------------------------------------------------
import { ControlContext } from "@/app/_components/Control";
import "./ChoiceGroup.css";


export function ChoiceGroup(props) {
  const fieldsetRef = useRef();
  const controlContext = useContext(ControlContext);
  const { name=useId(), valueToCompare="", arrayToCompare=[] } = props;
  const { onChange=(e)=>e } = props;
  const { className, style, children } = props;
  const labelId = controlContext?.labelId ?? useId();
  const requiredGroup = props.required ?? controlContext?.required ?? false;
  const disabledGroup = props.disabled ?? false;

  return (
    <ChoiceGroupContext.Provider value={{name, onChange, valueToCompare, arrayToCompare, requiredGroup, disabledGroup}}>
      <fieldset
        ref={fieldsetRef}
        className={clsx("choiceGroup", className)}
        style={style}
        aria-labelledby={labelId}
        role="group"
      >
        {children}
      </fieldset>
    </ChoiceGroupContext.Provider>
  );
}

export const ChoiceGroupContext = createContext();
export const CheckboxGroup = (props) => <ChoiceGroup {...props}/>
export const RadioGroup = (props) => <ChoiceGroup {...props}/>