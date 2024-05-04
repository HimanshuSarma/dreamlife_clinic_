const createDateFromDateString = (dateStr) => {
    // dateStr should be in the form: "dd/mm/yyyy"
    if (!dateStr) {
      return null;
    }
  
    const dateSplitted = dateStr?.split?.("/");
    const day = dateSplitted?.[0];
    const month = dateSplitted?.[1];
    const year = dateSplitted?.[2];
  
    const dtObj = new Date();
    dtObj?.setDate(day);
    dtObj?.setMonth(month - 1);
    dtObj?.setFullYear(year);
  
    return dtObj;
};

export {
    createDateFromDateString
}