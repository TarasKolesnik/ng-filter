import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { fuseAnimations } from '@fuse/animations';

interface IDate
{
  start: any,
  end: any
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-date',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations,
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DateComponent implements OnInit 
{
  campaignOne = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  @ViewChild('datepickerFooter', {static: false}) datepickerFooter: ElementRef;
  @Input('data') data: IDate
  @Output() returnSavedFilters = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.campaignOne.patchValue({ start: this.data.start })
    this.campaignOne.patchValue({ end: this.data.end })
  }

  onOpen() {
    this.appendFooter();
  }

  private appendFooter() {
    const matCalendar = document.getElementsByClassName('mat-datepicker-content')[0] as HTMLElement;
    matCalendar.appendChild(this.datepickerFooter.nativeElement);
  }

  today()
  {
    this.campaignOne.patchValue({ start: new Date() })
    this.campaignOne.patchValue({ end: new Date() })
    this.out()
  }

  yesterday()
  {
    let date = new Date();
    this.campaignOne.patchValue({ start: new Date(date.setDate(date.getDate() - 1)) })
    this.campaignOne.patchValue({ end: new Date(date.setDate(date.getDate())) })
    this.out()
  }

  last7days()
  {
    let date = new Date();
    this.campaignOne.patchValue({ start: new Date(date.setDate(date.getDate() - 7)) })
    this.campaignOne.patchValue({ end: new Date() })
    this.out()
  }

  last30days()
  {
    let date = new Date();
    this.campaignOne.patchValue({ start: new Date(date.setDate(date.getDate() - 30)) })
    this.campaignOne.patchValue({ end: new Date() })
    this.out()
  }

  thisMonth()
  {
    let date = new Date();
    this.campaignOne.patchValue({ start: new Date(date.getFullYear(), date.getMonth(), 1) })
    this.campaignOne.patchValue({ end: new Date() })
    this.out()
  }

  lastMonth()
  {
    let date = new Date();
    this.campaignOne.patchValue({ start: new Date(date.getFullYear(), date.getMonth() - 1, 1) })
    this.campaignOne.patchValue({ end: new Date(date.getFullYear(), date.getMonth(), 0) })
    this.out() 
  }

  endChange()
  {
    if( this.campaignOne.value.start && this.campaignOne.value.end )
    {
      this.out()
    }
  }

  out()
  {
    this.returnSavedFilters.emit({
      start: this.campaignOne.value.start,
      end: this.campaignOne.value.end,
    });
  }
}
