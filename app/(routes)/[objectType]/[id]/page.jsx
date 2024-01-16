import { getObjectById } from "@/app/api/objects/requests";
// -----------------------------------------------------------------------------
import { ObjectView } from "@/app/_ui/ObjectView";


export default async function ObjectViewPage({params, searchParams}) {
  const object = await getObjectById(params.id);

  return (
    <ObjectView searchParams={searchParams} {...object}/>
  )
}
