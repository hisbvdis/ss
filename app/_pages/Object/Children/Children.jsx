import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { ObjectContext } from "../Object";
import { Card } from "@/app/_components/Card/";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Children() {
  const { state } = useContext(ObjectContext);
  if (state.type !== "org") return null;

  return (
    <Card>
      <Card.Heading style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <span>На базе организации</span>
        <Link href={`/object/add/place?parent=${state.id}`}>Добавить</Link>
      </Card.Heading>

      <Card.Section>
        <ul className={styles["children__list"]}>
          {state.children?.map((child) => (
            <li key={child.id}>
              <Link className={styles["children__link"]} href={`/object/${child.id}`}>
                <Image className="object__childPhoto" src={child.photos?.length > 0 ? `/photos/${child.photos[0].name}`: "/icons/no-photo.svg"} width="178" height="120" alt="Image" loading="lazy"/>
                <span>{child.name_type}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card.Section>
    </Card>
  )
}