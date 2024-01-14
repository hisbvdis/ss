import Link from "next/link";
import { deleteSectionById, getAllSections } from "@/app/(routes)/api/sections/requests";

import { Card } from "@/app/_components/Card";
import { DelBtn } from "@/app/_components/DelBtn";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";


export default async function SectionListPage(props) {
  const sections = await getAllSections();

  return (
    <div className="container  page">
      <Breadcrumbs items={[{label: "Админка", href: "/admin"}, {label: "Разделы"}]}/>
      <Card className="mt10">
        <Link href="/admin/sections/add">Создать</Link>
        <ul style={{listStyle: "none", paddingInlineStart: 0}}>
          {sections.map(({id, name}) => (
            <li key={id} style={{display: "flex", gap: "10px"}}>
              <DelBtn id={id} delFunc={deleteSectionById}/>
              <Link href={`/admin/sections/${id}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
