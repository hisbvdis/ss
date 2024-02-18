"use client";
import clsx from "clsx";
import { useId, createContext, useState, useRef, useEffect } from "react"
// -----------------------------------------------------------------------------
import ControlLabel from "./ControlLabel";
import "./Control.module.css";


export default function Control(props:Props) {
  const ref = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const inputId = useId();
  const { className, style, children } = props;
  const [ required, setRequired ] = useState(props.required);

  useEffect(() => {
    if (!required && ref.current?.querySelector("[required]")) {
      setRequired(true);
    }
  }, [])

  return (
    <ControlContext.Provider value={{ labelId, required, inputId }}>
      <div ref={ref} className={clsx("control", className)} style={style}>
        {children}
      </div>
    </ControlContext.Provider>
  )
}

Control.Label = ControlLabel;

export const ControlContext = createContext<ControlContextType | null>(null);

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  required?: boolean;
}

interface ControlContextType {
  labelId: string;
  required: boolean;
  inputId: string;
}