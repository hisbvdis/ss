import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card/";
import { Swiper } from "@/app/_components/Swiper/";
import { ObjectContext } from "../Object";
// -----------------------------------------------------------------------------


export default function Gallery() {
  const { state } = useContext(ObjectContext);

  return (
    <Card>
      <Swiper photos={state.photos} width={565} height={350} navigation="true" speed="250" loop="true"/>
    </Card>
  )
}