import clsx from "clsx";
import styles from "./Flex.module.css";

export default function Flex(props:Props) {
  const { gap, direction="row" } = props;
  const { className, style, children } = props;

  return (
    <div
      className={clsx(styles["flex"], direction === "column" && styles["flex--column"], className)}
      style={{...style, gap: gap}}
    >
      {children}
    </div>
  )
}

interface Props {
  className: string;
  style: React.CSSProperties;
  children: React.ReactNode;
  gap: string;
  direction: "row" | "column";
}