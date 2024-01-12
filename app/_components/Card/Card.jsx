import clsx from "clsx";
import CardHeading from "./CardHeading";
import CardSection from "./CardSection";

export default async function Card(props) {
  const { children, className, style } = props;

  return (
    <section className={clsx("card", className)} style={style}>
      {children}
    </section>
  )
}

Card.Heading = CardHeading;
Card.Section = CardSection;