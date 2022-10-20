import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
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
    MatButtonModule
  ],
  exports: [
    IndexComponent
  ]
})
export class MyFilterModule { }
