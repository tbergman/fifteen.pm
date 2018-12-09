const PROD_ASSET_URL = 'https://assets.globally.ltd'
const DEV_ASSET_URL = '/assets/releases'

export const assetPath = (path) => {
  if (!path.startsWith('/')) {
    path = "/" + path;
  }
  if (process.env.NODE_ENV === 'development') {
    return `${DEV_ASSET_URL}${path}`
  } else {
    return `${DEV_ASSET_URL}${path}`
  }
}