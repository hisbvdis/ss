import clsx from "clsx";
import CardHeading from "./CardHeading";
import CardSection from "./CardSection";
import "./Card.css";


export default function Card(props) {
  const { label, children, className, style } = props;

  return (
    <section className={clsx("card", className)} style={style}>
      {label ? <Card.Heading>{label}</Card.Heading> : null}
      {children}
    </section>
  )
}

Card.Heading = CardHeading;
Card.Section = CardSection;