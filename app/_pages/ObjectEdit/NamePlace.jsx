import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Flex } from "@/app/_components/Flex";
import { Input } from "@/app/_components/Input";
import { Control } from "@/app/_components/Control";
import { Status, ObjectContext } from "@/app/_pages/ObjectEdit";
import { handleQuotes } from "@/app/_utils/handleQuotes";


export default function NamePlace(props) {
  const { state, handleStateChange } = useContext(ObjectContext);

  return (
    <Card className="mt10">
      <Card.Heading>Название и статус</Card.Heading>
      <Flex gap="10px">
        <Control>
          <Control.Label>Тип места</Control.Label>
          <Input
            name="name_type"
            value={state.name_type}
            onChange={(e) => handleStateChange(handleQuotes(e))}
            placeholder="Футбольное поле"
            required
          />
        </Control>
        <Control>
          <Control.Label>Расположение</Control.Label>
          <Input
            name="name_where"
            value={state.name_where}
            onChange={(e) => handleStateChange(handleQuotes(e))}
            disabled={state.parent_id}
            placeholder="у Школы №38"
            required
          />
        </Control>
      </Flex>
      <Status className="mt20"/>
    </Card>
  )
}
