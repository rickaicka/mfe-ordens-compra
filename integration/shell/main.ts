import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

const remoteHost = window.location.hostname;

const federationSource = environment.production
  ? '/federation.manifest.json'
  : {
      'remessas': `http://${remoteHost}:4301/remoteEntry.json`,
      'ordens-compra': `http://${remoteHost}:4305/remoteEntry.json`,
      'obras': `http://${remoteHost}:4303/remoteEntry.json`,
      'gestao-administrativa': `http://${remoteHost}:4304/remoteEntry.json`,
    };

initFederation(federationSource)
  .then(() => import('./bootstrap'))
  .catch((err) => {
    console.error('Falha ao inicializar o Daruix Hub:', err);
  });
