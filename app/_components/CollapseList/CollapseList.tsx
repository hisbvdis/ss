"use client";
import clsx from "clsx";
import { ArrowDownIcon } from "@/app/_icons";
import styles from "./styles.module.css";
import { useState } from "react";


export default function CollapseList(props:Props) {
  const { items } = props;
  const [ isOpen, setIsOpen ] = useState(false);

  if (!items.length) return null;
  return (
    <details open={isOpen} onToggle={() => setIsOpen(!isOpen)}>
      <summary className={clsx(styles["summary"], items.length > 1 && styles["summary--clickable"], styles["item"])}>
        <div>
          <a href={items[0].href} style={{color: "#0088CF", textDecoration: "none"}}>{items[0].label}</a>
          {isOpen && <p style={{color: "var(--fontColor-lighter)", fontSize: "0.8em"}}>{items[0].comment}</p>}
        </div>
        {items.length > 1 && <ArrowDownIcon/>}
      </summary>
      {items.length > 1
        ? items.slice(1).map((item) => (
            <div key={item.id} className={styles["item"]}>
              <a href={item.href} style={{color: "#0088CF", textDecoration: "none"}}>{item.label}</a>
              <p style={{color: "var(--fontColor-lighter)", fontSize: "0.8em"}}>{item.comment}</p>
            </div>
          ))
        : null
      }
    </details>
  )
}

interface Props {
  items: { id: string; label: string; comment: string, href: string }[];
}