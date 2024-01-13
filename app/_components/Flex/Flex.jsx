import clsx from "clsx";
import "./Flex.css";

export default function Flex(props) {
  const { direction="row" } = props;
  const { className, style, children } = props;

  return (
    <div
      className={clsx("flex", `flex--${direction}`, className)}
      style={style}
    >
      {children}
    </div>
  )
}
