import { SpecEdit } from "@/app/_pages/SpecEdit";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getEmptySpec, getSpecById } from "@/app/(router)/api/specs/requests";


export default async function SpecEditPage({params}) {
  const spec = (params.id === "add") ? await getEmptySpec() : await getSpecById(params.id);

  return (
    <div className="container  page">
      <Breadcrumbs items={[
        { label: "Админка", href: "/admin" },
        { label: "Характеристики", href: "/admin/specs" },
        { label: spec?.id ? "Редактировать" : "Создать" },
      ]}/>
      <SpecEdit init={spec}/>
    </div>
  );
}
