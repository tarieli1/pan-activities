import { NgModule } from '@angular/core';

import { AuthGuard, CamelCasePipe } from './';

const PIPES = [
  CamelCasePipe,
];

const GUARDS = [
  AuthGuard,
];

@NgModule({
  providers: [
    ...GUARDS,
  ],
  declarations: [
    ...PIPES,
  ],
  exports: [
    ...PIPES,
  ],
})
export class SharedModule {}