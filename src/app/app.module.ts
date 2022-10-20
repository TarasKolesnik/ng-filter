import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DateModule } from './date/date.module';
import { MyFilterModule } from './my-filter/my-filter.module';
import { SelectModule } from './select/select.module';
import { ConfirmComponent } from './confirm/confirm.component';
import { FilterComponent } from './filter/filter.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    ConfirmComponent
  ],
  imports: [
    DateModule,
    MyFilterModule,
    SelectModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatDatepickerModule,
    NgxMatSelectSearchModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
