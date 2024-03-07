"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// -----------------------------------------------------------------------------
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
// -----------------------------------------------------------------------------
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import { CloseIcon, SearchIcon } from "@/app/_components/Icons";
import styles from "./styles.module.css";


export default function SearchPanel() {
  const queryParam = useSearchParams().get("query");
  const [query, setQuery] = useState(queryParam);
  useEffect(() => setQuery(queryParam), [queryParam]);
  const manageSearchParams = useManageSearchParams();
  const router = useRouter();

  const clearSearchParams = () => {
    router.push(manageSearchParams("delete", "query"));
  }

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    router.push(manageSearchParams("leaveOnly", "query", query));
  }

  return (
    <section className={styles["searchPanel"]}>
      <div className="container">
        <form onSubmit={handleSubmit} style={{display: "flex"}}>
          <Input type="search" value={query} onChangeValue={setQuery} style={{paddingBlock: "5px", borderColor: "#E4E4E4"}}/>
          {query
            ? <Button onClick={clearSearchParams}>
                <CloseIcon/>
              </Button>
            : null
          }
          <Button type="submit">
            <SearchIcon width={18} height={18}/>
          </Button>
        </form>
      </div>
    </section>
  )
}