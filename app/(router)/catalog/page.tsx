import { getCityById } from "@/app/_db/city";
import { getObjectsByFilters } from "@/app/_db/object";
import { getSectionById, getSectionsByFilters } from "@/app/_db/section";
// -----------------------------------------------------------------------------
import { Catalog } from "@/app/_pages/Catalog";
import { SearchPanel } from "@/app/_ui/SearchPanel";


export default async function CatalogPage({searchParams}:{searchParams: ISearchParams}) {
  const city = searchParams.city ? await getCityById(Number(searchParams.city)) : undefined;
  const section = searchParams.section ? await getSectionById(Number(searchParams.section)) : undefined;
  const sectionList = await getSectionsByFilters();
  const searchResults = await getObjectsByFilters(searchParams);

  return (
    <>
      <SearchPanel />
      <Catalog
        searchParams={searchParams}
        city={city}
        sectionList={sectionList}
        searchResults={searchResults}
        section={section}
      />
    </>
  );
}

interface ISearchParams {
  city: string;
  section: string;
  options: string;
}