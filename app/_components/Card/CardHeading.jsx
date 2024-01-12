import clsx from "clsx";

export default function CardHeading(props) {
  const { children, className, style } = props;

  return (
    <div className={clsx("card__heading", className)} style={style}>
      {children}
    </div>
  )
}
