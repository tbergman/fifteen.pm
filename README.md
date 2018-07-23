## Globally Limited

- [HOMEPAGE](https://globally.ltd)
- [BANDCAMP](https://gltd.bandcamp.com)
- [SOUNDCLOUD](https://soundcloud.com)
- [EMAIL](mailto:dev[at]globally[dot]ltd)

[Globally Limited](https://globally.ltd) (GLTD) is a record label dedicated to creating online spaces for sound. GLTD releases comprise one or more tracks presented through an interactive website. Our sites lean heavily on next-generation web technologies like HTML5 and WebGL and their design and construction are a collaborative effort between the artist and the label. We believe that these sites are a unique and novel alternative to music being presented online as mere content in congested streams.

## Site Architecture

GLTD's website is a static, single-page [React](https://reactjs.org/) application which we deploy to Amazon S3](https://aws.amazon.com/s3/). React apps combine HTML, Javacript, and CSS into "Components" which can be modified by setting different properties (or `props`) via an XML-like syntax. In this way, components are designed to be reusable throughout the application. The idea here is that we can keep development on different aspects of the site (the menu, the play button, the purchase link, etc) isolated, so that contributors can easily incorporate these components into their sites and keep a common look and user experience across releases.

Here's a brief overview of some key Components:

-  [src/index.js](src/index.js)
  * This file ties together all of our components into a single application. It uses [react-router](https://github.com/ReactTraining/react-router) to determine what components get rendered given the requested path. For example `/` will render the homepage and `/1` will render the first release, etc.

- [src/App.js](src.App.js)
  * This file is responsible for rendering the homepage and setting some global styles (see [src/App.css](src/App.css)).
  * TODO: Refactor this component into a separate "Release"?

- TODO...

## Release Architecture

TODO ...

## Installation

```
git clone https://github.com/gltd/releases.git
cd releases/
npm i
```

## Starting a Development Server
```
yarn start # opens a browser to localhost:3000
```

## Deploying

```
yarn deploy-dev  # deploys to staging site
yarn deploy-prod # deploys to production site
```

## Browser Testing

We make heavy use of [BrowserStack](https://browserstack.com) for cross-browser and device testing.
[![Browser Stack](https://github.com/gltd/releases/raw/master/public/assets/browserstack-logo.png)](https://www.browserstack.com/)

