# ng-filter

varsion: 1

- leads.component.ts (index)
    - ngOnInit()
    - filter()
    - engageFastFilter()
    - clearFilter()
    - removeItemNewFilter()

- filter.component.ts
    - ngOnInit()
    - update()
    - checkCollectFilter()
    - updateDate()
    - collect()
    - accept()
    - returnCurrentFilter()
    - returnDate()
    - returnSelect()
    - getFilterList()
    - getCurrentFilter()

- date.component.ts
    - ngOnInit()
    - onOpen()
    - today()
    - yesterday()
    - last7days()
    - last30days()
    - thisMonth()
    - lastMonth()
    - endChange()
    - out()

- select.component.ts:
    - ngOnChanges()
    - out()
    - selectList()
    - toggleAllSelection()
    - select()
    - filterLists()

- my-filter/index.components.ts
    - ngOnChanges()
    - createFilter()
    - saveFilter()
    - getSavedFilters()
    - removeSavedFilter()
    - openSaveFilter()
    - removeItemNewFilter()

- _service/filter.service.ts
    - check()
    - getListItemsById()
    - checkCollectFilter()
    - getCurrentFilter()
    - updateDate()
    - collect()
    - getSavedFilters()

- Use dependency: 
    - https://material.angular.io/
    - https://themeforest.net/item/fuse-angularjs-material-design-admin-template/12931855
    - https://www.npmjs.com/package/ngx-mat-select-search
    - (Optional) https://tailwindcss.com/
