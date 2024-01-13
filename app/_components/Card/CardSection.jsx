import clsx from "clsx";

export default function _(props) {
  const { children, className, style } = props;

  return (
    <div className={clsx("card__section", className)} style={style}>
      {children}
    </div>
  )
}