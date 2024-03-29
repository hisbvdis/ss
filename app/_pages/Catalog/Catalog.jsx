"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { createContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Select } from "@/app/_components/Select";
import { Control } from "@/app/_components/Control";
import { Map, Marker } from "@/app/_components/Map";
import { Filters, Results, Categories } from "@/app/_pages/Catalog";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";
import "./styles.css";


export default function Catalog(props) {
  const { searchParams, searchResults, sectionList, section, city } = props;
  const router = useRouter();
  const manageSearchParams = useManageSearchParams();

  return (
    <CatalogContext.Provider value={{searchParams, searchResults, manageSearchParams, sectionList, router, section, city}}>
      <div className={clsx("catalog", "page", !searchParams?.map && "container", searchParams?.map && "catalog--map")}>
        <aside className="catalog__aside">
          <Card>
            <Control>
              <Control.Label>Город</Control.Label>
              <Select
                isAutocomplete
                value={Number(city?.id) || undefined}
                label={city?.name}
                onChange={(e) => router.push(manageSearchParams("set", "city", e.target.value))}
                placeholder="Введите название"
                requestItemsOnInputChange={async (value) => (await getCitiesByFilters({name: value}))
                  .map(({id, name, country_name, admin1_name, admin2_name}) => ({
                    id: id, label: name, label2: country_name, label3: admin1_name, label4: admin2_name
                  }))
                }
              />
            </Control>
          </Card>
          {searchParams?.section ? <Filters/> : <Categories/>}
        </aside>
        <main className="catalog__results">
          <Results/>
        </main>
        {searchParams?.map
          ? <aside className="catalog__map">
              <Map fitBoundsArray={searchResults.map(({coord_lat, coord_lon}) => ([coord_lat, coord_lon]))}>
                {searchResults.map(({coord_lat, coord_lon}, i) => <Marker key={i} coord={[coord_lat, coord_lon]}/>)}
              </Map>
            </aside>
          : null}
      </div>
    </CatalogContext.Provider>
  )
}

export const CatalogContext = createContext();