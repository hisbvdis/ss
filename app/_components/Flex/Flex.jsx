import clsx from "clsx";
import "./Flex.css";

export default function Flex(props) {
  const { gap, direction="row" } = props;
  const { className, style, children } = props;

  return (
    <div
      className={clsx("flex", direction === "column" && `flex--column`, className)}
      style={{...style, gap: gap}}
    >
      {children}
    </div>
  )
}
