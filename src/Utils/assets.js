const PROD_ASSET_URL = 'https://assets.globally.ltd'
const LOCAL_ASSET_URL = 'assets/releases'

export const assetPath = ({path, local:true}) => {
  if (local) {
    return `${LOCAL_ASSET_URL}/${path}`
  } else {
    return `${PROD_ASSET_URL}/${path}`
  }
}