import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .then(() => import('./bootstrap'))
  .catch((error) => console.error('Falha ao inicializar o MFE de ordens de compra:', error));
