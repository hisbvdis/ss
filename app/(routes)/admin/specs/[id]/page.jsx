import { SpecEdit } from "@/app/_ui/SpecEdit";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getSpecById } from "@/app/(routes)/api/specs/requests";
import { emptySpec } from "@/app/(routes)/api/specs/processing";


export default async function SpecEditPage({params}) {
  const spec = (params.id === "add") ? emptySpec : await getSpecById(params.id);

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
