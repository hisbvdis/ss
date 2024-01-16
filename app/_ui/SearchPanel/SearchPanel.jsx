"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// -----------------------------------------------------------------------------
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
// -----------------------------------------------------------------------------
import { SearchIcon } from "@/app/_icons";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import "./SearchPanel.css";


export default function SearchPanel(props) {
  const queryParam = useSearchParams().get("query");
  const [query, setQuery] = useState(queryParam);
  useEffect(() => setQuery(queryParam), [queryParam]);
  const manageSearchParams = useManageSearchParams();
  const router = useRouter();

  const clearSearchParams = () => {
    router.push(manageSearchParams("delete", "query"));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(manageSearchParams("leaveOnly", "query", query));
  }

  return (
    <section className={clsx("searchPanel")}>
      <div className="container">
        <form onSubmit={handleSubmit} style={{display: "flex"}}>
          <Input type="search" value={query} onChangeValue={setQuery} style={{paddingBlock: "5px", borderColor: "#E4E4E4"}}/>
          {query ? <Button onClick={clearSearchParams}>X</Button> : null}
          <Button type="submit">
            <SearchIcon width="18" height="18"/>
          </Button>
        </form>
      </div>
    </section>
  )
}
