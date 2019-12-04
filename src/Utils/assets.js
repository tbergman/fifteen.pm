// const PROD_ASSET_URL = 'https://assets.globally.ltd'
const ASSET_URL = '/assets'

export const assetPath = (path) => {
  if (!path.startsWith('/')) {
    path = "/" + path;
  }
  return `${ASSET_URL}${path}`
}

export const assetPathShared = (path) => {
  return assetPath("shared/" + path);
}
