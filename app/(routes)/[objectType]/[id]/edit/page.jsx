import { ObjectEdit } from "@/app/_ui/ObjectEdit";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/(routes)/api/objects/requests";


export default async function ObjectEditPage({params}) {
  const object = await getObjectById(params.id);

  return (
    <ObjectEdit init={object}/>
  )
}