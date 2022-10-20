import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterComponent } from './filter/filter.component';
import { FilterService } from './_services/filter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit
{
  savedFilters: any[] = [];
  currentFilter: any = [];
  nameSavedFilter: string = 'filter/products';
  nameCurrentFilter: string = 'filter/products/current';

  constructor(
    private _dialog: MatDialog,
    private _filter: FilterService,
  ) {}

  ngOnInit(): void 
  {
    this.savedFilters = this._filter.getSavedFilters(this.nameSavedFilter);
    this.currentFilter = this._filter.getCurrentFilter(this.nameCurrentFilter);
  }

  filter()
  {
    const dialogRef = this._dialog.open( FilterComponent, {
      data: {
        nameSavedFilter: this.nameSavedFilter,
        nameCurrentFilter: this.nameCurrentFilter,
      }
    } );

    dialogRef.afterClosed().subscribe( ( result: any ) => 
    {
      // send request to backend with get params (result)
      console.log(result)

      this.savedFilters = this._filter.getSavedFilters(this.nameSavedFilter)
      this.currentFilter = this._filter.getCurrentFilter(this.nameCurrentFilter)
    });
  }

  engageFastFilter(item: any)
  {
    // send request to backend with get params (item)
    console.log(item)
  }

  removeItemNewFilter(item: any, name: string)
  {
    let filter1 = this.currentFilter.filter( (t: any) => {
      if( t.name == name ) { return t.name }
    })

    filter1[0].filter.splice( filter1[0].filter.find( (t: any) => t.id === item.id ), 1 )

    let a: any = localStorage.getItem(this.nameCurrentFilter)
    let getFilter = JSON.parse(a)
    
    getFilter[name] = filter1[0].filter

    localStorage.setItem(this.nameCurrentFilter, JSON.stringify( getFilter ))

    this.engageFastFilter(getFilter)
  }

  clearFilter()
  {
    this.currentFilter = []
    localStorage.removeItem(this.nameCurrentFilter)
    this.engageFastFilter({})
  }
}
