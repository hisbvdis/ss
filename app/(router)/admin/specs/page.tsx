import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { DelBtn } from "@/app/_components/DelBtn";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { deleteSpecById, getSpecsByFilters } from "@/app/_db/spec";


export default async function SpecListPage() {
  const specs = await getSpecsByFilters();

  return (
    <div className="container  page">
      <Breadcrumbs items={[{label: "Админка", href: "/admin"}, {label: "Характеристики"}]}/>
      <Card className="mt10">
        <Card.Section style={{flex: "100%"}}>
          <Link href="/admin/specs/add">Создать</Link>
        </Card.Section>
        <Card.Section>
          <ul style={{listStyle: "none", paddingInlineStart: 0}}>
            {specs?.map(({id, name_service}) => (
              <li key={id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={id} delFunc={deleteSpecById}/>
              <Link href={`/admin/specs/${id}`}>{name_service}</Link>
            </li>
            ))}
          </ul>
        </Card.Section>
      </Card>
    </div>
  )
}