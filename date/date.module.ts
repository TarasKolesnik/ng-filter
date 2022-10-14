import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateComponent } from './date.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DateComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatChipsModule,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    DateComponent
  ]
})
export class DateModule { }
