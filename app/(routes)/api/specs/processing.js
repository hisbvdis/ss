export const specsReadProcessing = (dbData) => {
  const processed = {
    ...dbData,
    options: dbData.options.map((opt) => ({...opt,localId: crypto.randomUUID()})),
  }
  return processed;
}