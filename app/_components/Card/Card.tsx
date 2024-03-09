import clsx from "clsx";
import CardHeading from "./CardHeading";
import CardSection from "./CardSeciton";
import styles from "./styles.module.css";

export default function Card(props:IProps) {
  const { className, children, style } = props;
  // const { heading } = props;

  return (
    <section className={clsx(styles.card, className)} style={style}>
      {/* {heading ? <Card.Heading>{heading}</Card.Heading> : null} */}
      {children}
    </section>
  )
}

Card.Heading = CardHeading;
Card.Section = CardSection;

interface IProps {
  className?: string,
  children?: React.ReactNode,
  style?: React.CSSProperties,
  heading?: string,
}