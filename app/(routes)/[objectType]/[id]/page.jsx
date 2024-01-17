import { ObjectView } from "@/app/_ui/ObjectView";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/(routes)/api/objects/requests";


export default async function ObjectViewPage({params, searchParams}) {
  const object = await getObjectById(params.id);

  return (
    <ObjectView searchParams={searchParams} {...object}/>
  )
}