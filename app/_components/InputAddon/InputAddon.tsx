import styles from "./styles.module.css";


export default function InputAddon(props:IProps) {
  const { children } = props;

  return (
    <span className={styles["inputAddon"]}>
      {children}
    </span>
  )
}

interface IProps {
  children: React.ReactNode;
}