import {Component, AfterViewInit, ViewEncapsulation, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ReplaySubject, SubscriptionLike} from 'rxjs';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-leads',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements AfterViewInit, OnInit 
{
  savedFilters = [];
  currentFilter = [];

  constructor(
    private _dialog: MatDialog,
  ) {}

  ngOnInit(): void 
  {
    this.getSavedFilters()
    this.getCurrentFilter()
  }

  getCurrentFilter()
  {
    let filterStorage = localStorage.getItem('filter/leads/current');
    let newFilter = [];

    if( filterStorage )
    {
      let parseFilterStorage = JSON.parse(filterStorage)

      for( let item in parseFilterStorage )
      {
        let a = parseFilterStorage[item]
         
        newFilter.push({
          name: item,
          filter: a
        })
      }

      this.currentFilter = newFilter
    }
  }
  
  filter()
  {
    const dialogRef = this._dialog.open( FilterComponent, {
      panelClass: ['md:w-3/5', 'w-full'],
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe( result => 
    {
      this.getSavedFilters()
      this.getCurrentFilter()

      // send request to backend with get params (result)
      console.log(result)
    });
  }

  engageFastFilter(item)
  {
    // send request to backend with get params (item)
    console.log(item)
  }

  getSavedFilters()
  {
    let filterStorage = localStorage.getItem('filter/leads');

    if( filterStorage )
    {
      let parseFilterStorage = JSON.parse(filterStorage)
      this.savedFilters = parseFilterStorage
    }
  }

  removeItemNewFilter(item, name)
  {
    let filter1 = this.currentFilter.filter( t => {
      if( t.name == name ) { return t.name }
    })

    filter1[0].filter.splice( filter1[0].filter.find( t => t.id === item.id ), 1 )

    let getFilter = JSON.parse(localStorage.getItem('filter/leads/current'))
    
    getFilter[name] = filter1[0].filter

    localStorage.setItem('filter/leads/current', JSON.stringify( getFilter ))

    this.engageFastFilter(getFilter)
  }

  clearFilter()
  {
    this.currentFilter = []
    localStorage.removeItem('filter/leads/current')
    this.engageFastFilter({})
  }
}