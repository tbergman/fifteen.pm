[![CircleCI](https://circleci.com/gh/gltd/releases.svg?style=svg)](https://circleci.com/gh/gltd/releases)

## fifteen.pm

- [HOMEPAGE](https://fifteen.pm)
- [EMAIL](mailto:dev[at]globally[dot]ltd)

[fifteen.pm](https://fifteen.pm) is a record label dedicated to creating online spaces for sound. Releases comprise one or more tracks presented through an interactive website. Our sites lean heavily on HTML5 and WebGL and their design and construction are a collaborative effort between the artist and the label. We believe that these sites are a unique and novel alternative to music being presented online as content in congested streams.

## Release Asset Management

We store all assets for releases under [`public/assets/releases/`](public/assets/releases). We version all assets under this path with [`git-lfs`](https://git-lfs.github.com/), or as otherwise defined in [`.gitattributes`](.gitattributes).

#### To access an asset in a Release Component, follow this pattern:

```js
import { assetPath } from "../Utils/assets";

// A helper to access a path for a specific release
const assetPath4 = (p) => {
  return assetPath("4/" + p);
}

// Another, video-specific helper
const assetPath4Videos = (p) => {
  return assetPath4("videos/" + p);
}

let videoSrc = assetPath4Videos('er-99-cts-broadway-1.webm');
```
**NOTE**: In development this path will be prefixed by `/assets/releases`. In production, it will by prefixed by `https://assets.globally.ltd/`

## Installation

```
git clone https://github.com/gltd/releases.git
cd releases/
yarn install
```

## Starting a Development Server
```
yarn start # opens a browser to localhost:3000
```

## Deploying

We use [CircleCI](https://circleci.com/gh/gltd/releases) for deploys. 

- Pushes to the `develop` branch will automatically be deployed to [dev.globally.ltd](https://dev.globally.ld)
- Pushes to the `master` branch will automatically be deployed to [globally.ltd](https://globally.ltd)


Manually: 
```
yarn deploy-dev  # deploys to staging site
yarn deploy-prod # deploys to production site
```
