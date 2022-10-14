import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SelectComponent
  ],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    TranslocoModule,
    FormsModule,
    CommonModule
  ],
  exports: [
    SelectComponent
  ]
})
export class SelectModule { }
