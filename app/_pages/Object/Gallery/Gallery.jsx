import Image from "next/image";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card/";
// -----------------------------------------------------------------------------
import { ObjectContext } from "../Object";


export default function Gallery() {
  const { state } = useContext(ObjectContext);

  return (
    <Card>
      <Image className="object__photo" src={state.photos?.length > 0 ? `/photos/${state.photos[0].name}`: "/icons/no-photo.svg"} width="565" height="350" alt="Image" priority={true}/>
    </Card>
  )
}