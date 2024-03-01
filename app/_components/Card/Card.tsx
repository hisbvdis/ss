import clsx from "clsx";
import CardHeading from "./CardHeading";
import CardSection from "./CardSeciton";
import styles from "./styles.module.css";

export default function Card(props:Props) {
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

interface Props {
  className?: string,
  children?: React.ReactNode,
  style?: React.CSSProperties,
  heading?: string,
}