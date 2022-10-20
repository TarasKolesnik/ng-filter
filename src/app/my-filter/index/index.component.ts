import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, 
  Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';

interface IInput {
  name: string,
  checkCollectFilter: boolean,
  filterData: any[]
}

interface IFilterDetail {
  name: string,
  filter: any[]
}

@Component({
  selector: 'my-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnChanges 
{
  isSaveFilter = false
  isFilterDetail = false
  filterDetail: IFilterDetail = {
    name: '',
    filter: []
  }
  savedFilters = []

  protected _onDestroy = new Subject<void>();

  public savedFiltersS: Subject<any> = new Subject;

  constructor(
    private _dialog: MatDialog
  ) { }

  @Input('input') input: IInput = {
    name: '',
    checkCollectFilter: false,
    filterData: []
  };
  @Output() returnSavedFilters = new EventEmitter<any>();

  ngOnChanges(changes:SimpleChanges)
  {
    this.savedFilters = this.getSavedFilters()
    setTimeout( () => {
      this.savedFiltersS.next(this.savedFilters)
    })
    this.returnSavedFilters.emit(this.savedFilters);
  }

  createFilter()
  {
    if( this.input )
    {
      if( this.input.checkCollectFilter === false )
      {
        this._dialog.open( ConfirmComponent, {
          data: {
            title: 'Filter setup is empty',
            message: 'Select something',
            actions: {
              confirm: {
                show: false
              }
            }
          }
        });
        return;
      }
  
      if( this.isSaveFilter == true )
      {
        this.isSaveFilter = false
      } else {
        this.isSaveFilter = true
      }
    }
  }

  saveFilter(value: any)
  {
    let parseSavedFilters = []

    if( this.input )
    {
      if( this.input.checkCollectFilter === false )
      {
        this._dialog.open( ConfirmComponent, {
          data: {
            title: 'Filter setup is empty',
          message: 'Select something',
          actions: {
            confirm: {
              show: false
            }
          }
          }
        });
        return;
      }
  
      if( !value )
      {
        this._dialog.open( ConfirmComponent, {
          data: {
            title: 'Filter name is empty',
            message: 'Enter to filter name',
            actions: { confirm: { show: false } }
          }
        });
        return;
      }
  
      let count = 0;

      for( let key in this.input.filterData )
      {
        count = count + this.input.filterData[key].length
      }
  
      if(count < 1)
      {
        this._dialog.open( ConfirmComponent, {
          data: {
            title: 'Filter is empty',
            message: 'Fill filter',
            actions: { confirm: { show: false } }
          }
        });
        return;
      }
  
      parseSavedFilters = this.getSavedFilters()
  
      parseSavedFilters.push({
        name: value,
        filter: this.input.filterData,
      })
  
      this.savedFilters = parseSavedFilters
  
      localStorage.setItem(this.input.name, JSON.stringify(parseSavedFilters))
  
      this.savedFiltersS.next(this.savedFilters)
  
      this.returnSavedFilters.emit(parseSavedFilters);
  
      this.isSaveFilter = false
    }
  }

  getSavedFilters()
  {
    let parseSavedFilters = []

    if( this.input )
    {
      if( localStorage.getItem(this.input.name) )
      {
        let getSavedFilters: any = localStorage.getItem(this.input.name);
        parseSavedFilters = JSON.parse(getSavedFilters)
      }
    }

    return parseSavedFilters;
  }

  removeSavedFilter(item:any)
  {
    if( this.input )
    {
      const dialogRef = this._dialog.open( ConfirmComponent, {
        data: {
          title: 'Delete filter',
          message: 'Are you sure you want to confirm this action?',
          actions: {
            confirm: {
              show: true,
              label: 'Delete'
            },
            cancel: {
              show: true,
              label: 'Cancel'
            }
          }
        }
      });

      dialogRef.afterClosed().subscribe((result: any) => 
      {
        if( result == 'confirmed' )
        {
          let a: any = localStorage.getItem(this.input.name)
          let getFilter = JSON.parse(a)
          getFilter.splice( getFilter.findIndex( (t: any) => t.name == item.name ), 1 )
          
          localStorage.setItem(this.input.name, JSON.stringify( getFilter ))
  
          this.savedFilters = getFilter
  
          this.savedFiltersS.next(this.savedFilters)
        }
      })
    }
  }

  openSaveFilter(item: any)
  {
    this.isFilterDetail = true
    this.filterDetail = item
  }

  removeItemNewFilter(item: any, name: any)
  {
    if( this.input )
    {
      this.input.filterData[name].splice( this.input.filterData[name].find( (t: any) => t === item ), 1 )
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
