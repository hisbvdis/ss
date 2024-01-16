import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { DelBtn } from "@/app/_components/DelBtn";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { deleteSpecById, getSpecsByFilters } from "@/app/(routes)/api/specs/requests";


export default async function SpecListPage(props) {
  const specs = await getSpecsByFilters();

  return (
    <div className="container  page">
      <Breadcrumbs items={[{label: "Админка", href: "/admin"}, {label: "Характеристики"}]}/>
      <Card className="mt10">
        <Link href="/admin/specs/add">Создать</Link>
        <ul style={{listStyle: "none", paddingInlineStart: 0}}>
          {specs?.map(({id, name_service}) => (
            <li key={id} style={{display: "flex", gap: "10px"}}>
              <DelBtn id={id} delFunc={deleteSpecById}/>
            <Link href={`/admin/specs/${id}`}>{name_service}</Link>
          </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}