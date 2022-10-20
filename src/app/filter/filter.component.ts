import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { FilterService } from '../_services/filter.service';

@Component({
  selector: 'app-filter',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})

export class FilterComponent implements OnInit 
{
  nameFilter: string = '';
  nameCurrentFilter: string = '';
  filterForm: FormGroup = new FormGroup({
    start: new FormControl( '' ),
    end: new FormControl( '' ),
    status: new FormControl( [] ),
    country: new FormControl( [] ),
  });
  date = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  filterData: any;
  isLoading = true;
  savedFilters: any = [];
  selectedCountry: any[] = [];
  selectedStatus: any[] = [];
  
  dates: any[] = [];
  countries: any[] = [];
  statuses: any[] = [];

  private _onDestroy = new Subject<void>();

  inputStatusSelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'status', list: [] });
  inputCountrySelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'country', list: [] });
  inputLanguageSelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'language', list: [] });

  filteredCountries: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredLanguages: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredStatuses: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  filter: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(
    private _filter: FilterService,
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.nameCurrentFilter = data.nameCurrentFilter
    this.nameFilter = data.nameSavedFilter

    dialogRef.beforeClosed().subscribe( () => {
      dialogRef.close(this.collect());
    })
  }

  ngOnInit(): void 
  {
    this.getCurrentFilter()
    this.getFilterList()
    this.update()
  }

  update()
  {
    this.filter.next({
      name: this.nameFilter,
      checkCollectFilter: this.checkCollectFilter(),
      filterData: this.collect()
    })
  }

  checkCollectFilter()
  {
    return this._filter.checkCollectFilter([
      this.dates,
      this.selectedCountry,
      this.selectedStatus,
    ])
  }

  updateDate()
  {
    if( 
      this.date.value.start &&
      this.date.value.end
    )
    {
      let start = new Date(this.date.value.start)
      let end = new Date(this.date.value.end)
  
      let startDay = ( start.getDate() ).toString().padStart(2, '0')
      let endDay = ( end.getDate() ).toString().padStart(2, '0')

      let startMonth = ( start.getMonth() + 1 ).toString().padStart(2, '0')
      let endMonth = ( end.getMonth() + 1 ).toString().padStart(2, '0')
  
      this.dates = []
      this.dates.push(startDay + '.' + startMonth + '.' + start.getFullYear())
      this.dates.push(endDay + '.' + endMonth + '.' + end.getFullYear())
    }
  }

  collect()
  {
    return this._filter.collect([
      { name: 'dates', selected: [], list: this.dates },
      { name: 'status', selected: this.selectedStatus, list: this.statuses },
      { name: 'country', selected: this.selectedCountry, list: this.countries },
    ]);
  }

  accept()
  {
    localStorage.setItem(this.nameCurrentFilter, JSON.stringify(this.collect()));
    this.dialogRef.close(this.collect());
  }

  returnCurrentFilter(filter: any)
  {
    this.savedFilters = filter
  }

  returnDate(data: any)
  {
    this.date.patchValue({ start: data.start })
    this.date.patchValue({ end: data.end })

    this.updateDate()
    this.update()
    this.getFilterList()
  }

  returnSelect(data: any)
  {
    if( data.name == 'status' ) { this.selectedStatus = data.selected }
    if( data.name == 'country' ) { this.selectedCountry = data.selected }
    
    this.update()
  }

  getFilterList()
  {
    this.isLoading = true

    let date = {};

    if( this.dates.length > 1 )
    {
      date = { date: this.dates.join(',') }
    }

    this._filter.getFilterList(date).then((result:any) => 
    { 
      this.countries = result.country;
      this.statuses = result.status;

      this.filteredCountries.next(this.countries.slice());
      this.filteredStatuses.next(this.statuses.slice());
      
      this.inputStatusSelect.next({ name: 'status', list: this.statuses.slice() });
      this.inputCountrySelect.next({ name: 'country', list: this.countries.slice() });
    }, () => {
      this.filteredCountries.next([]);
      this.filteredStatuses.next([]);
      this.filteredLanguages.next([]);
      
      this.inputStatusSelect.next({ name: 'status', list: [] });
      this.inputCountrySelect.next({ name: 'country', list: [] });
      this.inputLanguageSelect.next({ name: 'language', list: [] });
      
    }).finally(() => 
    {
      this.isLoading = false
    })
  }

  getCurrentFilter()
  {
    let filterStorage = localStorage.getItem(this.nameCurrentFilter);

      if( filterStorage )
      {
        let parseFilterStorage = JSON.parse(filterStorage)
        this.savedFilters = parseFilterStorage

        if( typeof this.savedFilters['date'] !== 'undefined' )
        {
          let date = this.savedFilters['date']

          if( typeof date[0] !== 'undefined' )
          { 
            let date0 = date[0].split('.')
            this.date.patchValue({ start: new Date(date0[2], date0[1] -1, date0[0]) })
          }

          if( typeof date[1] !== 'undefined' )
          {
            let date1 = date[1].split('.')
            this.date.patchValue({ end: new Date(date1[2], date1[1] -1, date1[0]) })
          }
        }

        const country = this._filter.check(this.savedFilters, 'country', this.inputCountrySelect)

        if( country )
        {
          this.selectedCountry = country.selected
          this.inputCountrySelect = country.input
        }

        const status = this._filter.check(this.savedFilters, 'status', this.inputStatusSelect)

        if( status )
        {
          this.selectedStatus = status.selected
          this.inputStatusSelect = status.input
        }
      }

      this.updateDate()
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
