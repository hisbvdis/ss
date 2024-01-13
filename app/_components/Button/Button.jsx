import clsx from "clsx";
import "./Button.css";


export default function Button(props) {
  const { className, id, style, children } = props;
  const { type="button", onClick, tabIndex, disabled } = props;

  return (
    <button
      {...props}
      className={clsx("button", className)}
      style={style}
      type={type}
      onClick={onClick}
      tabIndex={tabIndex}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
