import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
import { Card } from "@/app/_components/Card";
import { getAllSpecs } from "@/app/_db/specs.db";
import Link from "next/link";

export default async function SpecsPage(props) {
  const specs = await getAllSpecs();

  return (
    <div className="container">
      <Breadcrumbs items={[{label: "Админка", href: "/admin"}, {label: "Характеристики"}]}/>
      <Card className="mt10">
        <Card.Section>
          <Link href="/admin/specs/add">Создать</Link>
        </Card.Section>
        <Card.Section>
          <ul style={{listStyle: "none", paddingInlineStart: 0}}>
            {specs.map(({id, name_service}) => (
              <li key={id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={id} delFunc={deleteSpec}/>
              <Link href={`/admin/specs/${id}`}>{name_service}</Link>
            </li>
          ))}
        </ul>
      </Card.Section>
    </Card>
    </div>
  )
}
