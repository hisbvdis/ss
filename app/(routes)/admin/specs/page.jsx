import Link from "next/link";
import { Card } from "@/app/_components/Card";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
import { deleteSpecById, getAllSpecs } from "@/app/(routes)/api/specs/funcs";
import { DelBtn } from "@/app/_components/DelBtn";


export default async function SpecsPage(props) {
  const specs = await getAllSpecs();

  return (
    <div className="container">
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