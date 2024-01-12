import clsx from "clsx";
import Link from "next/link";
import "./Breadcrumbs.css";

export default function Breadcrumbs(props) {
  const { items, size } = props;
  const { className, id, style } = props;

  return (
    <nav className={clsx("breadcrumbs", size==="small" && "breadcrumbs--small", className)} id={id} style={style}>
      <ul className="breadcrumbs__list">
        {items?.filter(({label}) => label).map(({label, href}, i) => (
          <li className="breadcrumbs__item" key={i}>
            {href
              ? <Link className="breadcrumbs__link" href={href}>{label}</Link>
              : <span className="breadcrumbs__span">{label}</span>
            }
          </li>
        ))}
      </ul>
    </nav>
  )
}
