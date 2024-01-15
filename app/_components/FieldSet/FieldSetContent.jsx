import clsx from "clsx";
import "./FieldSetContent.css";

export default function FieldSetContent(props) {
  const { children, className, style, row } = props;

  return (
    <div className={clsx("fieldSetContent", className, row && "fieldSetContent--row")} style={style}>
      {children}
    </div>
  )
}
