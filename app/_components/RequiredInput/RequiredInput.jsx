// <RequiredInput name={name} required={requiredGroup}/>
import { useId } from "react";
import "./RequiredInput.css";

export default function RequiredInput(props) {
  const { name=useId(), isValidIf=false, checked=false } = props;

  return (
    <input type="radio" className="requiredInput" name={name} checked={checked} onChange={e=>e} required={!isValidIf} tabIndex="-1"/>
  )
}
