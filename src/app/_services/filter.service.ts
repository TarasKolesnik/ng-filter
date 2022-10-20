import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class FilterService
{

  constructor() {}

  check( savedFilters: any, name: string, input: any )
  {
    if( typeof savedFilters[name] == 'undefined' ) { return false; }

    let statuses = savedFilters[name]
    let selected = savedFilters[name]

    input.subscribe((result: any) => 
    {
      if( result )
      {
        if( result.list.length )
        {
          for( let item of statuses )
          {
            result.list.find( (t: any) => t.id == item.id ).selected = true
          }
        }
      }
    })

    return {
      selected: selected,
      input: input
    };
  }

  getListItemsById(ids: any, from: any)
  {
    let new_a = [];

    for( let item of ids )
    {
      let a = from.find( (t: any) => t.id == item )

      if( a )
      {
        new_a.push({ id: item, name: a.name })
      }
    }

    return new_a
  }

  checkCollectFilter( lists:any = [] ): boolean
  {
    let n = 0;

    for( let list of lists )
    {
      if( list.length > 0 ) { n++; }
    }

    if( n > 0 ) { return true; } else { return false; }
  }

  getCurrentFilter( name: string )
  {
    let filterStorage: any = localStorage.getItem(name);
    let newFilter = [];

    if( filterStorage !== 'null' )
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
    }

    return newFilter;
  }

  updateDate(campaignOne: any)
  {
    let dates = []

    if( 
      campaignOne.value.start &&
      campaignOne.value.end
    )
    {
      let start = new Date(campaignOne.value.start)
      let end = new Date(campaignOne.value.end)
  
      let startDay = ( start.getDate() ).toString().padStart(2, '0')
      let endDay = ( end.getDate() ).toString().padStart(2, '0')

      let startMonth = ( start.getMonth() + 1 ).toString().padStart(2, '0')
      let endMonth = ( end.getMonth() + 1 ).toString().padStart(2, '0')

      dates.push(startDay + '.' + startMonth + '.' + start.getFullYear())
      dates.push(endDay + '.' + endMonth + '.' + end.getFullYear())
    }

    return dates;
  }

  collect( items: any )
  {
    let filterData: any = {};

    for( let item of items )
    {
      // exeption
      if( item.name == 'dates' )
      {
        if( item.list.length > 0 )
        {
          filterData['date'] = item.list
        }
      } else {
        if( item.selected.length > 0 )
        {
          let elements = this.getListItemsById(item.selected, item.list)
          filterData[item.name] = elements
        }
      }
    }

    return filterData;
  }

  getSavedFilters(name: string)
  {
    let savedFilters = [];
    let filterStorage: any = localStorage.getItem(name);

    if( filterStorage !== 'null' )
    {
      let parseFilterStorage = JSON.parse(filterStorage)
      savedFilters = parseFilterStorage
    }

    return savedFilters;
  }

  getFilterList(params: any): Promise<any> 
  {
    /*return new Promise((resolve,reject) => {
        this.http.get( '/api/v1/list', { params: params })
        .subscribe(
            ( result:any ) => { resolve(result) }, reject 
        )
    })*/

    return new Promise((resolve,reject) => {
      resolve({
        country: [
          { id: 1, name: 'Country 1' },
          { id: 2, name: 'Country 2' },
          { id: 3, name: 'Country 3' },
          { id: 4, name: 'Country 4' },
          { id: 5, name: 'Country 5' },
        ],
        status: [
          { id: 1, name: 'Status 1' },
          { id: 2, name: 'Status 2' },
          { id: 3, name: 'Status 3' },
          { id: 4, name: 'Status 4' },
          { id: 5, name: 'Status 5' },
        ]
      })
    })
  }
}
