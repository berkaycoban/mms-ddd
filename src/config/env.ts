export const IS_PROD = process.env.NODE_ENV === 'production';
export const PORT = process.env.PORT ?? 1923;

function loadConfig() {
  return {
    isProd: IS_PROD,
    port: PORT,
  };
}

export { loadConfig };
