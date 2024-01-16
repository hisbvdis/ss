import { ObjectEdit } from "@/app/_ui/ObjectEdit";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/_db/object.db.js";


export default async function Page({params}) {
  const object = await getObjectById(params.id);

  return (
    <ObjectEdit init={object}/>
  )
}