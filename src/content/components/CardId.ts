export const CardId = (() => {
  let counter = 1;
  let prefixCharCode = 65; //A

  return function nextId() {
    const id = String.fromCharCode(prefixCharCode) + counter;
    counter++;

    if (counter > 99) {
      counter = 1;
      prefixCharCode++;

      if (prefixCharCode > 90) prefixCharCode = 65;
    }
    return id;
  };
})();
