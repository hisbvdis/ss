export async function queryCoodFromAddress({country, city, street, limit=1, lang="ru-RU"}) {
  if (typeof country !== "string" || country.length === 0) return;
  if (typeof city !== "string" || city.length === 0) return;

  let baseUrl = "https://nominatim.openstreetmap.org/search.php?"
    .concat(`country=${country.replaceAll(" ", "+")}`)
    .concat(`&city=${city.replaceAll(" ", "+")}`)
    .concat(`&street=${street ? street.replaceAll(" ", "+") : ""}`)
    .concat(`&limit=${limit}`)
    .concat(`&accept-language=${lang}`)
    .concat("&format=jsonv2")

  const result = await fetch(baseUrl).then((r) => r.json()).then((data) => data[0]);
  return result;
}

export async function queryAddressForCoord({lat, lon, limit=1, lang="ru-RU"}) {
  let baseUrl = "https://nominatim.openstreetmap.org/reverse?"
    .concat(`&lat=${lat}&lon=${lon}`)
    .concat(`&limit=${limit}`)
    .concat(`&accept-language=${lang}`)
    .concat("&format=jsonv2")

  const result = await fetch(baseUrl).then((r) => r.json());
  return result;
}
