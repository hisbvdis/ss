export const emptyObject = {
  status: "works",
  schedule: [
    {day_num: 1, name_ru_short: "Пн"},
    {day_num: 2, name_ru_short: "Вт"},
    {day_num: 3, name_ru_short: "Ср"},
    {day_num: 4, name_ru_short: "Чт"},
    {day_num: 5, name_ru_short: "Пт"},
    {day_num: 6, name_ru_short: "Сб"},
    {day_num: 7, name_ru_short: "Вс"},
  ],
}

export const objectReadProcessing = (state) => {
  const processed = {
    ...state,
  }
  return processed;
}

export const objectWriteProcessing = (incomingState, incomingInit) => {
  const state = structuredClone(incomingState);
  const init = structuredClone(incomingInit);

  return processed;
}