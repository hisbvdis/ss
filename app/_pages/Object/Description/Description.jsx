"use client";
import clsx from "clsx";
import { useContext, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import { ObjectContext } from "../Object";
import { Card } from "@/app/_components/Card/";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Description() {
  const { state } = useContext(ObjectContext);
  if (!state.description) return null;
  const textRef = useRef();
  const [ isTrimText, setIsTrimText ] = useState(false);
  const [ isShowFullText, setIsShowFullText ] = useState(false);

  useEffect(() => {
    if (textRef.current.scrollHeight > textRef.current.clientHeight) {
      setIsTrimText(true);
    }
  }, [])

  return (
    <Card className={styles["desc"]}>
      <p className={clsx(styles["desc__content"], !isShowFullText && styles["desc__content--short"])} ref={textRef}>
        {state.description}
      </p>
      {isTrimText && <button className={styles["desc__btn"]} onClick={() => setIsShowFullText(!isShowFullText)}>
        {isShowFullText ? "Меньше" : "Больше"}
      </button>}
    </Card>
  )
}