export const IS_PROD = process.env.NODE_ENV === 'production';
export const PORT = process.env.PORT ?? 1923;

export function loadConfig() {
  return {
    isProd: IS_PROD,
    port: PORT,

    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  };
}
