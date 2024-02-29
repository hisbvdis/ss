// <ChoiceGroup name="name" valueToCompare={""} arrayToCompare={[]} onChange={(e)=>e}>
"use client";
import clsx from "clsx";
import { ReactEventHandler, createContext, useContext, useId, useRef } from 'react';
// -----------------------------------------------------------------------------
import { ControlContext } from "@/app/_components/Control";
import styles from "./styles.module.css";

export const CheckboxGroup = (props:Props) => <ChoiceGroup {...props}/>
export const RadioGroup = (props:Props) => <ChoiceGroup {...props}/>

function ChoiceGroup(props:Props) {
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
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
        className={clsx(styles["choiceGroup"], className)}
        style={style}
        aria-labelledby={labelId}
        role="group"
      >
        {children}
      </fieldset>
    </ChoiceGroupContext.Provider>
  );
}

export const ChoiceGroupContext = createContext<ChoiceGroupContextType>({});

interface Props {
  name?: string;
  valueToCompare?: string;
  arrayToCompare?: any[];
  onChange?: ReactEventHandler;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

interface ChoiceGroupContextType {
  name?: string;
  onChange?: ReactEventHandler;
  valueToCompare?: string;
  arrayToCompare?: any[];
  requiredGroup?: boolean;
  disabledGroup?: boolean;
}