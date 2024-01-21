import { getCityById } from "@/app/(routes)/api/cities/requests"
import { getObjectsCount, getObjectsByFilters } from "@/app/(routes)/api/objects/requests";
import { getSectionById, getSectionsByFilters } from "@/app/(routes)/api/sections/requests";
// -----------------------------------------------------------------------------
import { Catalog } from "@/app/_ui/Catalog";
import { SearchPanel } from "@/app/_ui/SearchPanel";


export default async function CatalogPage({searchParams}) {
  const city = searchParams.city ? await getCityById(searchParams.city) : undefined;
  const section = searchParams.section ? await getSectionById(searchParams.section) : undefined;
  const sectionList = await getSectionsByFilters();
  const searchResults = await getObjectsByFilters(searchParams);
  const objectCounts = searchParams.section ? await getObjectsCount(searchParams.section, searchParams.options) : undefined;

  return (
    <>
      <SearchPanel />
      <div className="container  page">
        <Catalog
          searchParams={searchParams}
          city={city}
          sectionList={sectionList}
          searchResults={searchResults}
          section={section}
          objectCounts={objectCounts}
        />
      </div>
    </>
  );
}