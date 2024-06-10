import bcrypt from 'bcryptjs';

export const hashStr = async (s: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(s, salt);
};

export const compareStr = async (s: string, hash: string) => {
  return await bcrypt.compare(s, hash);
};
