import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Flex } from "@/app/_components/Flex";
import { Status, ObjectContext } from "@/app/_ui/ObjectEdit";
import { Control } from "@/app/_components/Control";
import { Input } from "@/app/_components/Input";


export default function NamePlace(props) {
  const { state, handleChangeWithQuotes } = useContext(ObjectContext);

  return (
    <Card className="mt10">
      <Card.Heading>Название и статус</Card.Heading>
      <Flex gap="10px">
        <Control>
          <Control.Label>Тип места</Control.Label>
          <Input
            name="name_type"
            value={state.name_type}
            onChange={handleChangeWithQuotes}
            placeholder="Футбольное поле"
            required
          />
        </Control>
        <Control>
          <Control.Label>Расположение</Control.Label>
          <Input
            name="name_where"
            value={state.name_where}
            onChange={handleChangeWithQuotes}
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
