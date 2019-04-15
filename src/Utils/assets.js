// const PROD_ASSET_URL = 'https://assets.globally.ltd'
const DEV_ASSET_URL = '/assets'

export const assetPath = (path) => {
  if (!path.startsWith('/')) {
    path = "/" + path;
  }
  return `${DEV_ASSET_URL}${path}`
}