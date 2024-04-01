export const createRandomStr = (length?: number) => {
  const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(Array(length ?? 20))
    .map(() => S[Math.floor(Math.random() * S.length)])
    .join("");
};
