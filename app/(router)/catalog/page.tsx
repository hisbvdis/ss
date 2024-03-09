import { getObjectsCount, getObjectsByFilters } from "@/app/(router)/api/objects/requests";
import { getCityById } from "@/app/_db/city";
import { getSectionById, getSectionsByFilters } from "@/app/_db/section";
// -----------------------------------------------------------------------------
import { Catalog } from "@/app/_pages/Catalog";
import { SearchPanel } from "@/app/_ui/SearchPanel";


export default async function CatalogPage({searchParams}:{searchParams: SearchParams}) {
  const city = searchParams.city ? await getCityById(Number(searchParams.city)) : undefined;
  const section = searchParams.section ? await getSectionById(Number(searchParams.section)) : undefined;
  const sectionList = await getSectionsByFilters();
  const searchResults = await getObjectsByFilters(searchParams);
  const objectCounts = searchParams.section ? await getObjectsCount(searchParams.section, searchParams.options) : undefined;

  return (
    <>
      <SearchPanel />
      <Catalog
        searchParams={searchParams}
        city={city}
        sectionList={sectionList}
        searchResults={searchResults}
        section={section}
        objectCounts={objectCounts}
      />
    </>
  );
}

interface SearchParams {
  city: string;
  section: string;
  options: string;
}