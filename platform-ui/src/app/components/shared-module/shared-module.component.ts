import { NgModule } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';

@NgModule({
  imports: [TimeagoModule.forRoot()],
  exports: [TimeagoModule],
})
export class SharedModule {}
