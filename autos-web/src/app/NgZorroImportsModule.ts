import { NgModule } from '@angular/core';
// NG-ZORRO imports
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  imports: [
    NzSpinModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule
  ],
  exports: [
    NzSpinModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule
  ]
})
export class NgZorroImportsModule {}
