export const createCredentials = (token) =>
  Buffer.from(`bearer ${token}`).toString('base64');
