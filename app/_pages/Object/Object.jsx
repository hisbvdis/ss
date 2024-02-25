"use client";
import clsx from "clsx";
import { createContext } from "react";
// -----------------------------------------------------------------------------
import { Header, Gallery, Description, Children, Specs, Info, Service } from "."
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Object(props) {
  return (
    <ObjectContext.Provider value={{state: props.state}}>
      <div className={clsx(styles["objectPage"], "container", "page")}>
        <Header className={styles["objectPage__header"]}/>
        <main className={styles["objectPage__main"]}>
          <article className={styles["objectPage__article"]}>
            <Gallery/>
            <Description/>
            <Children/>
            <Specs/>
          </article>
          <aside className={styles["objectPage__aside"]}>
            <Info/>
            <Service/>
          </aside>
        </main>
      </div>
    </ObjectContext.Provider>
  )
}

export const ObjectContext = createContext();