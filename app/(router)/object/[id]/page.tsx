import { getObjectById } from "@/app/_db/object";
import { Object } from "@/app/_pages/Object";
// -----------------------------------------------------------------------------


export default async function ObjectPage({params, searchParams}:IProps) {
  const object = await getObjectById(Number(params.id));

  return (
    <Object state={object} searchParams={searchParams}/>
  )
}

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string };
}