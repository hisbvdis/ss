"use client";
import clsx from "clsx";
import { useState } from "react";
// -----------------------------------------------------------------------------
import { ArrowDownIcon } from "@/app/_components/Icons";
import styles from "./styles.module.css";


export default function CollapseList(props:Props) {
  const { items } = props;
  const [ isOpen, setIsOpen ] = useState(false);

  if (!items.length) return null;
  return (
    <details open={isOpen} onToggle={() => setIsOpen(!isOpen)}>
      <summary className={clsx(styles["summary"], styles["item"])}>
        <div className={styles["summary__inner"]}>
          <a className={styles["link"]} href={items[0].href}>{items[0].label}</a>
          {items.length > 1 && <ArrowDownIcon fill="#808080"/>}
        </div>
        {isOpen && <span className={styles["subtitle"]}>{items[0].comment}</span>}
      </summary>
      {items.length > 1 ? items.slice(1).map((item) => (
        <div key={item.id} className={styles["item"]}>
          <a className={styles["link"]} href={item.href}>{item.label}</a>
          <p className={styles["subtitle"]}>{item.comment}</p>
        </div>
      )) : null}
    </details>
  )
}

interface Props {
  items: Item[];
}

interface Item {
  id: string;
  label: string;
  comment: string;
  href: string;
}