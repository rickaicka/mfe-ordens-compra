const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'ordens-compra',
  exposes: { './Routes': './src/app/remote-entry/entry.routes.ts' },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
    '@daruix/hub-auth': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  },
  skip: [/^@ionic\/core(?:\/|$)/, /^ionicons(?:\/|$)/, 'rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
  features: { ignoreUnusedDeps: true },
});
