import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Subject } from 'rxjs';

interface IInput {
  name: string,
  checkCollectFilter: boolean,
  filterData: any
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
  filterDetail = {}
  savedFilters = []

  protected _onDestroy = new Subject<void>();

  public savedFiltersS: Subject<any> = new Subject;

  constructor(
    private _fuseConfirmationService: FuseConfirmationService
  ) { }

  @Input('input') input: IInput
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
    if( this.input.checkCollectFilter === false )
    {
      this._fuseConfirmationService.open({
        title: 'Filter setup is empty',
        message: 'Select something',
        actions: {
          confirm: {
            show: false
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

  saveFilter(value)
  {
    let parseSavedFilters = []

    if( this.input.checkCollectFilter === false )
    {
      this._fuseConfirmationService.open({
        title: 'Filter setup is empty',
        message: 'Select something',
        actions: {
          confirm: {
            show: false
          }
        }
      });
      return;
    }

    if( !value )
    {
      this._fuseConfirmationService.open({
        title: 'Filter name is empty',
        message: 'Enter to filter name',
        actions: { confirm: { show: false } }
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
      this._fuseConfirmationService.open({
        title: 'Filter is empty',
        message: 'Fill filter',
        actions: { confirm: { show: false } }
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

  getSavedFilters()
  {
    let parseSavedFilters = []

    if( this.input )
    {
      if( localStorage.getItem(this.input.name) )
      {
        let getSavedFilters = localStorage.getItem(this.input.name);
        parseSavedFilters = JSON.parse(getSavedFilters)
      }
    }

    return parseSavedFilters;
  }

  removeSavedFilter(item:any)
  {
    const dialogRef = this._fuseConfirmationService.open({});

    dialogRef.afterClosed().subscribe((result: any) => 
    {
      if( result == 'confirmed' )
      {
        let getFilter = JSON.parse(localStorage.getItem(this.input.name))
        getFilter.splice( getFilter.findIndex( t => t.name == item.name ), 1 )
        
        localStorage.setItem(this.input.name, JSON.stringify( getFilter ))

        this.savedFilters = getFilter

        this.savedFiltersS.next(this.savedFilters)
      }
    })
  }

  openSaveFilter(item)
  {
    this.isFilterDetail = true
    this.filterDetail = item
  }

  removeItemNewFilter(item, name)
  {
    this.input.filterData[name].splice( this.input.filterData[name].find( t => t === item ), 1 )
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
