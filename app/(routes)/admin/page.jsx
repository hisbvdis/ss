import Link from "next/link";

// import { Card } from "@/app/_components/Card";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";


export default async function AdminPage(props) {
  return (
    <div className="container">
      <Breadcrumbs items={[{label: "Админка"}]}/>
      {/* <Card className="card--mt">
        <Card.Section>
          <ul style={{listStyle: "none", paddingInlineStart: 0}}>
            <li>
              <Link href="/admin/sections">Разделы</Link>
            </li>
            <li>
              <Link href="/admin/specs">Характеристики</Link>
            </li>
          </ul>
        </Card.Section>
      </Card> */}
    </div>
  )
}