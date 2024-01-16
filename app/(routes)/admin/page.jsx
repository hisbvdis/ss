import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";


export default async function AdminPage(props) {
  return (
    <div className="container  page">
      <Breadcrumbs items={[{label: "Админка"}]}/>
      <Card className="mt10">
        <ul style={{listStyle: "none", paddingInlineStart: 0}}>
          <li>
            <Link href="/admin/sections">Разделы</Link>
          </li>
          <li>
            <Link href="/admin/specs">Характеристики</Link>
          </li>
        </ul>
      </Card>
    </div>
  )
}