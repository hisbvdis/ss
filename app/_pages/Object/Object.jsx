"use client";
import clsx from "clsx";
import { createContext } from "react";
// -----------------------------------------------------------------------------
import { Header, Description, Children, Specs, Contacts, Service, Gallery } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Object(props) {
  return (
    <ObjectContext.Provider value={{state: props.state}}>
      <div className={clsx(styles["object"], "container", "page")}>
        <Header className={styles["object__header"]}/>
        <article className={styles["object__article"]}>
          <Gallery/>
          <Description/>
          <Children/>
          <Specs/>
        </article>
        <aside className={styles["object__aside"]}>
          <Contacts/>
          <Service/>
        </aside>
      </div>
    </ObjectContext.Provider>
  )
}

export const ObjectContext = createContext();