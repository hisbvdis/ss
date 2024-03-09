import clsx from "clsx";
import styles from "./styles.module.css";

export default function _(props: IProps) {
  const { className, children, style } = props;

  return (
    <div className={clsx(styles.card__section, className)} style={style}>
      {children}
    </div>
  );
}

interface IProps {
  className?: string,
  children?: React.ReactNode,
  style?: React.CSSProperties
}