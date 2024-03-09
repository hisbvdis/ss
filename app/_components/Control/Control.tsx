"use client";
import clsx from "clsx";
import { useId, createContext, useState, useRef, useEffect } from "react"
// -----------------------------------------------------------------------------
import ControlLabel from "./ControlLabel";
import "./styles.module.css";


export default function Control(props:IProps) {
  const ref = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const inputId = useId();
  const { className, style, children } = props;
  const [ required, setRequired ] = useState(props.required ?? false);

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

export const ControlContext = createContext<IControlContextType | null>(null);

interface IProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  required?: boolean;
}

interface IControlContextType {
  labelId: string;
  required: boolean;
  inputId: string;
}