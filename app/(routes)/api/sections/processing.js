export const sectionReadProcessing = (dbData) => {
  const processed = {
    ...dbData,
    specs: dbData.specs.map(({spec}) => spec),
  }
  return processed;
}

export const sectionWriteProcessing = (incomingState) => {
  const state = structuredClone(incomingState);
  const processed = {
    name: state.name || null,
    object_type: state.object_type || null,
  }
  return processed;
}