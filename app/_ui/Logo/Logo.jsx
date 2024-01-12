import Link from "next/link";
import "./Logo.css";

export default function Logo() {
  return (
    <div className="logo">
      <Link className="logo__link" href="/catalog">SaySport</Link>
    </div>
  )
}
