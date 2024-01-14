import Link from "next/link";

import { Logo } from "@/app/_ui/Logo/";
import "./PageHeader.css";


export default function PageHeader() {
  return (
    <header className="pageHeader">
      <div className="container  pageHeader__container">
        <Logo/>
        <Link className="pageHeader__link" href="/catalog">Catalog</Link>
        <Link className="pageHeader__link" href="/admin">Admin</Link>
        <Link className="pageHeader__link" href="/org/add">Add org</Link>
        <Link className="pageHeader__link" href="/place/add">Add place</Link>
      </div>
    </header>
  )
}