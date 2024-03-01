import { useSearchParams } from "next/navigation";


export const useManageSearchParams = () => {
  const searchParams = useSearchParams();

  return (action: Actions, key:string, value:string | string[]) => {
    value = String(value);
    let urlSearchParams = new URLSearchParams(searchParams);
    switch (action) {
      case "set": {
        urlSearchParams.set(key, value);
        break;
      }
      case "append": {
        const valueSet = new Set(urlSearchParams.get(key)?.split(","));
        valueSet.has(value) ? valueSet.delete(value) : valueSet.add(value);
        const valueString = [...valueSet].toSorted((a, b) => a > b ? 1 : -1).join(",");
        valueString === "" ? urlSearchParams.delete(key) : urlSearchParams.set(key, valueString);
        break;
      }
      case "delete": {
        if (Array.isArray(key)) {
          key.forEach((key) => urlSearchParams.delete(key));
        } else {
          urlSearchParams.delete(key);
        }
        break;
      }
      case "leaveOnly": {
        const currentValue = value ? value : urlSearchParams.get(key);
        urlSearchParams = new URLSearchParams();
        urlSearchParams.set(key, currentValue);
        break;
      }
    }
    if (!value) urlSearchParams.delete(key);
    return decodeURIComponent(`?${urlSearchParams}`) || "?";
  }
}

enum Actions {
  set = "set",
  append = "append",
  delete = "delete",
  leaveOnly = "leaveOnly",
}