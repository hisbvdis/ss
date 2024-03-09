import clsx from "clsx";
import styles from "./styles.module.css";

export default function Flex(props:IProps) {
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

interface IProps {
  className: string;
  style: React.CSSProperties;
  children: React.ReactNode;
  gap: string;
  direction: "row" | "column";
}