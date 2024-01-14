export const specReadProcessing = (dbData) => {
  const processed = {
    ...dbData,
    options: dbData.options.map((opt) => ({...opt, localId: crypto.randomUUID()})),
  }
  return processed;
}

export const specWriteProcessing = (incomingState) => {
  const state = structuredClone(incomingState);
  const processed = {
    ...state,
    options: state.options?.map((option) => ({...option, localId: undefined})),
  }
  delete processed.id;
  return processed;
}