import { ObjectEdit } from "@/app/_ui/ObjectEdit";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { emptyObject } from "@/app/(routes)/api/objects/processing";


export default async function AddObjectPage({params, searchParams}) {
  const parent = searchParams.parent ? await getObjectById(searchParams.parentId) : null;

  return (
    <div className="container  page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: `Добавить ${params.objectType === "org" ? "организацию" : "место"}` },
      ]}/>
      <ObjectEdit init={{...emptyObject, type: params.objectType}} parent={parent}/>
    </div>
  )
}