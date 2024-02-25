import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Input } from "@/app/_components/Input";
import { Control } from "@/app/_components/Control";
import { Status, ObjectContext } from "@/app/_pages/ObjectEdit";
import { handleQuotes } from "@/app/_utils/handleQuotes";


export default function NameOrg(props) {
  const { state, handleStateChange } = useContext(ObjectContext);

  return (
    <Card className="mt10">
      <Card.Heading>Название и статус</Card.Heading>
      <Control>
        <Control.Label>Название организации</Control.Label>
        <Input
          name="name_full"
          value={state.name_full}
          onChange={(e) => handleStateChange.value(handleQuotes(e))}
          placeholder="Фитнес-клуб «FitnessOK» Центральный"
          required
        />
      </Control>
      <Control className="mt20">
        <Control.Label>Локативная форма названия</Control.Label>
        <Input
          name="name_where"
          value={state.name_where}
          onChange={(e) => handleStateChange.value(handleQuotes(e))}
          placeholder="в клубе «FitnessOK» Центральный"
          required
        />
      </Control>
      <Status className="mt20"/>
    </Card>
  )
}