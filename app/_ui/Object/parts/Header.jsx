import clsx from "clsx";
import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Flex } from "@/app/_components/Flex";
import { Card } from "@/app/_components/Card";
import { DelBtn } from "@/app/_components/DelBtn";
import { ObjectContext } from "../Object";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { deleteObject } from "@/app/(routes)/api/objects/requests";


export default function Header(props) {
  const { state } = useContext(ObjectContext);
  const { className, style } = props;

  return (
    <header className={clsx("header", className)} style={style}>
      <Card>
        <Flex>
          <Breadcrumbs size="small" items={[
            {label: "Каталог", href: "/catalog"},
            {label: `${state.city?.name ?? ""}`, href: `/catalog?city=${state.city?.id}`},
            {label: `${state.sections?.[0]?.name ?? ""}`, href: `/catalog?city=${state.city?.id}&section=${state.sections?.[0]?.id}`}
          ]}/>
          <a href={`/object/${state.id}/edit`} style={{marginInlineStart: "auto"}}>Ред</a>
          <DelBtn id={state.id} delFunc={deleteObject} redirectPath="/">X</DelBtn>
        </Flex>
        <h1 style={{fontSize: "23rem", fontWeight: "400"}}>{state.name_full}</h1>
        {state.parent_id ? <Link href={`/object/${state.parent_id}`}>&lt; {state.parent?.name_full}</Link> : null}
      </Card>
    </header>
  )
}