import { ObjectEdit } from "@/app/_pages/ObjectEdit";
// -----------------------------------------------------------------------------
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
import { getObjectById } from "@/app/_db/object";


export default async function ObjectEditPage({params}:{params: {id:string, type: string}}) {
  const object = await getObjectById(Number(params.id));

  return (
    <div className="container  page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: `${object.name_full}`, href: `/object/${object.id}` },
        { label: `Редактировать ${params.type === "org" ? "организацию" : "место"}` },
      ]}/>
      <ObjectEdit init={object}/>
    </div>
  )
}