import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Input } from "@/app/_components/Input";
import { Control } from "@/app/_components/Control";
import { Status, ObjectContext } from "@/app/_ui/ObjectEdit";


export default function NameOrg(props) {
  const { state, handleChangeWithQuotes } = useContext(ObjectContext);

  return (
    <Card className="mt10">
      <Card.Heading>Название и статус</Card.Heading>
      <Control>
        <Control.Label>Название организации</Control.Label>
        <Input
          name="name_full"
          value={state.name_full}
          onChange={handleChangeWithQuotes}
          placeholder="Фитнес-клуб «FitnessOK» Центральный"
          required
        />
      </Control>
      <Control>
        <Control.Label>Обстоятельство места</Control.Label>
        <Input
          name="name_where"
          value={state.name_where}
          onChange={handleChangeWithQuotes}
          placeholder="в клубе «FitnessOK» Центральный"
          required
        />
      </Control>
      <Status className="mt20"/>
    </Card>
  )
}