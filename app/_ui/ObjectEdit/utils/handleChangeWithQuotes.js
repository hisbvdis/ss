export const handleChangeWithQuotes = (e, setState) => {
  setState((state) => {
    const entries = Array.from(e.target.value.matchAll(/["]/g));
    if (entries.length === 1) {
      state[e.target.name] = e.target.value.replace(/["]/, () => Array.from(state[e.target.name].matchAll(/[«»]/g)).length % 2 === 0 ? "«" : "»");
    } else if (entries.length >= 2) {
      state[e.target.name] = entries.reduce((acc, {input, index}, i) => acc ? acc.split("").with(index, i % 2 === 0 ? "«" : "»").join("") : input.split("").with(index, i % 2 === 0 ? "«" : "»").join(""), null);
    } else {
      state[e.target.name] = e.target.value;
    }
  })
}