# ng-filter

varsion: 0.2

Demo: https://youtu.be/rj7Ze5-N188

- src/app/add.component.ts
    - ngOnInit()
    - filter()
    - engageFastFilter()
    - removeItemNewFilter()
    - clearFilter()

- src/app/filter/filter.component.ts
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

- src/app/date/date.component.ts
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

- src/app/select/select.component.ts:
    - ngOnChanges()
    - out()
    - selectList()
    - toggleAllSelection()
    - select()
    - filterLists()

- src/app/my-filter/index/index.components.ts
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
    - getFilterList()

- Use dependency: 
    - https://material.angular.io/
    - https://www.npmjs.com/package/ngx-mat-select-search
