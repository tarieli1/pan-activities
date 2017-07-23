import { NgModule } from '@angular/core';

import { AuthGuard, CamelCasePipe, DaysPipe } from './';

const PIPES = [
  CamelCasePipe,
  DaysPipe,
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