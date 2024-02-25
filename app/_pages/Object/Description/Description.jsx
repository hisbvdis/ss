import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card/";
// -----------------------------------------------------------------------------
import { ObjectContext } from "../Object";


export default function Description() {
  const { state } = useContext(ObjectContext);

  return (<>
    {state.description
      ? <Card style={{whiteSpace: "pre-line"}}>
          <Card.Section>{state.description}</Card.Section>
        </Card>
      : null
    }
  </>)
}