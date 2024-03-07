// <BottomPanel id={state.id} delFunc={deleteObject} exitRedirectPath="./" delRedirectPath="/"/>
"use client";
import Link from "next/link";
// -----------------------------------------------------------------------------
import { Button } from "@/app/_components/Button";
import { DelBtn } from "@/app/_components/DelBtn";
import styles from "./styles.module.css";


export default function BottomPanel(props:Props) {
  const { id, delFunc, exitRedirectPath, delRedirectPath } = props;

  return (
    <section className={styles["bottomPanel"]}>
      <div className="container" style={{display: "flex", gap: "15px"}}>
        <Button type="submit">Сохранить</Button>
        <Button type="submit" data-leave-page>Сохранить и выйти</Button>
        {id ? <Link href={exitRedirectPath} style={{marginInlineStart: "auto", color: "white"}}>Выйти без сохранения</Link> : null}
        {id ? <DelBtn id={id} delFunc={delFunc} redirectPath={delRedirectPath}>Удалить</DelBtn> : null}
      </div>
    </section>
  )
}

interface Props {
  id: number;
  delFunc: (id: number) => Promise<void>;
  exitRedirectPath: string;
  delRedirectPath: string;
}