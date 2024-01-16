import { ObjectEdit } from "@/app/_ui/ObjectEdit";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getEmptyObject } from "@/app/(routes)/api/objects/requests";


export default async function AddObjectPage({params, searchParams}) {
  const emptyObject = await getEmptyObject();
  const parent = searchParams.parent ? await getObjectById(Number(searchParams.parent)) : null;

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