export const isValidHolderName = (holderName: string): boolean => {
  const isValid = /^[ｦ-ﾟ 0-9A-Z\)]*$/.test(holderName);
  return isValid;
};
