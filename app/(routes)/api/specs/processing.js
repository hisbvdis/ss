export const emptySpec = {
  object_type: "org",
  control_type: "checkbox",
}

export const specReadProcessing = (dbData) => {
  const processed = {
    ...dbData,
    options: dbData.options.map((opt) => ({...opt,localId: crypto.randomUUID()})),
  };
  return processed;
}

export const specWriteProcessing = (incomingState) => {
  const state = structuredClone(incomingState);
  const processed = {
    ...state,
    options: state.options?.map((option) => ({...option, local: undefined})),
  };
  return processed;
}