const generateHex = (): string => {
  return Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, "0");
};

export default generateHex;
