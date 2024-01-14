export const sectionReadProcessing = (state) => {
  const processed = {
    ...state,
    specs: state.specs.map(({spec}) => spec)
  }
  return processed;
}

export const sectionWriteProcessing = (incomingState) => {
  const state = structuredClone(incomingState);
  const processed = {
    ...state,
  }
  return processed;
}
