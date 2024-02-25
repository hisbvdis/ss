export const sectionReadProcessing = (dbData) => {
  const processed = {
    ...dbData,
    specs: dbData.specs.map(({spec}) => spec),
  }
  return processed;
}
