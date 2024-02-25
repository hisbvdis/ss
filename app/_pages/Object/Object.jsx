"use client";
import clsx from "clsx";
import { createContext } from "react";
// -----------------------------------------------------------------------------
import { Header, Content, Info } from "."
import { Flex } from "@/app/_components/Flex";
// -----------------------------------------------------------------------------
import styles from "./Object.module.css";


export default function Object(props) {
  const state = props.state;

  return (
    <ObjectContext.Provider value={{state}}>
      <div className={clsx(styles["object"], "container", "page")}>
        <Header className={styles["object__header"]}/>
        <Flex gap="10px">
          <Content className={styles["object__content"]}/>
          <Info className={styles["object__info"]}/>
        </Flex>
      </div>
    </ObjectContext.Provider>
  )
}

export const ObjectContext = createContext();