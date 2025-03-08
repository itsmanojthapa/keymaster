import bcrypt from "bcryptjs";

export const encryptPassword = async (password: string) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  const isit = await bcrypt.compare(password, hashedPassword);
  return isit;
};
