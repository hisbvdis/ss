import { useContext } from "react";
// -----------------------------------------------------------------------------
import { ObjectContext } from "../Object";
import { Card } from "@/app/_components/Card/";
// -----------------------------------------------------------------------------

export default function Service(props) {
  const { className, style } = props;
  const { state } = useContext(ObjectContext);

  return (
    <Card className={className} style={style}>
      <Card.Section>
        <p>Последняя правка:</p>
        <p>{state.modified}</p>
      </Card.Section>
    </Card>
  )
}