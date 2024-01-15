import clsx from "clsx";
import CardHeading from "./CardHeading";
import CardSection from "./CardSection";
import "./Card.css";


export default function Card(props) {
  const { heading, children, className, style } = props;

  return (
    <section className={clsx("card", className)} style={style}>
      {heading ? <Card.Heading>{heading}</Card.Heading> : null}
      {children}
    </section>
  )
}

Card.Heading = CardHeading;
Card.Section = CardSection;