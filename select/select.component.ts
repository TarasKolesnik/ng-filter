import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { IList } from 'app/_interfaces/list';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';

interface IData {
  list: any[],
  name: string,
  multiple?: boolean
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
}) 
export class SelectComponent implements OnChanges
{
  public isLoading = true
  public multiple = true
  public lists: IList[] = [];
  public selectedList = []
  protected _onDestroy = new Subject<void>();
  public listFilterCtrl: FormControl = new FormControl();
  public filteredLists: ReplaySubject<IList[]> = new ReplaySubject<IList[]>(1);
  
  fieldForm: FormGroup = new FormGroup({
    list: new FormControl( [] ),
  })

  @ViewChild('allSelected') private allSelected: MatOption;
  @Input('data') data: IData
  @Output() returnSavedFilters = new EventEmitter<any>();

  constructor() {}

  ngOnChanges() 
  {
    if(this.data)
    {
      this.multiple = ( this.data.multiple ?? true )
      this.lists = this.data.list
      this.filteredLists.next(this.data.list.slice())

      let selected = []
      
      for( let item of this.data.list )
      {
        if( item.selected == true )
        {
          selected.push(item.id)
        }
      }

      setTimeout(() => {
        this.fieldForm.patchValue({ list: selected })
        this.out()
      }, 1)

      this.listFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => { 
        this.filterLists() 
      });
      this.isLoading = false
    }
  }

  out()
  {
    let finishList = [];
    
    if( this.multiple == true )
    {
      finishList = this.selectedList.filter( (item) => 
      {
        if( item > 0 ) { return item; }
      } )
    } else {
      finishList = this.selectedList
    }

    this.returnSavedFilters.emit({
      selected: finishList,
      name: this.data.name
    });
  }

  selectList(value)
  {
    if(typeof value !== 'object')
    {
      value = [ value ]
    }

    this.selectedList = value

    this.out()
  }

  toggleAllSelection() 
  {
    if (this.allSelected.selected) 
    {
      let snapshotList = [];
      this.filteredLists.subscribe((result) => {
        snapshotList = result
      })

      this.fieldForm.controls.list.patchValue([...snapshotList.map(item => item.id), 0]);
    } else {
      this.fieldForm.controls.list.patchValue([]);
    }

    this.out()
  }

  select(item: any)
  {
    if( this.multiple == true )
    {
      if( this.allSelected.selected ) 
      {
        this.allSelected.deselect();
        this.out()
        return false;
      }
    } else {
      this.fieldForm.patchValue({ list: item.id })
    }

    if(this.fieldForm.controls.list.value.length==this.lists.length)
    {
      this.allSelected.select();
      this.out()
    }
  } 

  filterLists() 
  {
    if (!this.lists) { return; }

    let search = this.listFilterCtrl.value;

    if (!search) 
    {
      this.filteredLists.next(this.lists.slice());
      this.out()
      return;
    } else {
      this.allSelected.deselect();
      this.fieldForm.controls.list.patchValue([]);
      search = search.toLowerCase();
    }
    
    this.filteredLists.next(
      this.lists.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );

    this.out()
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
