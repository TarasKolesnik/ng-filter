import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { MatChipsModule } from '@angular/material/chips';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardModule } from '@fuse/components/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    FuseCardModule,
    MatButtonModule,
    TranslocoModule,
  ],
  exports: [
    IndexComponent
  ]
})
export class MyFilterModule { }
