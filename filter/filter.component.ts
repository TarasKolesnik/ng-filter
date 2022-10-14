import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FilterService } from 'app/_services/filter.service';
import { otherService } from 'app/_services/other.service';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'app-filter',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})

export class FilterComponent implements OnInit 
{
  filterForm: FormGroup = new FormGroup({
    start: new FormControl( '' ),
    end: new FormControl( '' ),
    status: new FormControl( [] ),
    country: new FormControl( [] ),
    domian: new FormControl( [] ),
    campaign: new FormControl( [] ),
    pixel: new FormControl( [] ),
    affiliate: new FormControl( [] ),
    team: new FormControl( [] ),
    partner: new FormControl( [] ),
  });
  date = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  filterData;
  isLoading = true;
  savedFilters = []
  selectedCountry: any[] = [];
  selectedStatus: any[] = [];
  selectedDomain: any[] = [];
  selectedPixel: any[] = [];
  selectedCampaign: any[] = [];
  selectedTeam: any[] = [];
  selectedPartner: any[] = [];
  selectedAffiliate: any[] = [];
  selectedLanguage: any[] = [];
  selectedBroker: any[] = [];
  
  dates: any[] = [];
  brokers: any[] = [];
  countries: any[] = [];
  campaigns: any[] = [];
  statuses: any[] = [];
  domains: any[] = [];
  pixeles: any[] = [];
  affiliates: any[] = [];
  teams: any[] = [];
  partners: any[] = [];
  languages: any[] = [];
  isAffiliate = false;

  private _onDestroy = new Subject<void>();

  public inputStatusSelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'status', list: [] });
  public inputCountrySelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'country', list: [] });
  public inputDomainSelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'domain', list: [] });
  public inputCampaignSelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'campaign', list: [] });
  public inputPixelSelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'pixel', list: [] });
  public inputAffiliateSelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'affiliate', list: [] });
  public inputTeamSelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'team', list: [] });
  public inputPartnerSelect: BehaviorSubject<any> = new BehaviorSubject<any>({ name: 'partner', list: [] });

  public filteredCountries: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredCampaings: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredStatuses: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredDomains: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredPixeles: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredAffiliates: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredPartners: ReplaySubject<any[]> = new ReplaySubject<IList []>(1);

  public filter: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(
    private _other: otherService,
    private _filter: FilterService,
    private _fuseConfirmationService: FuseConfirmationService,
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    dialogRef.beforeClosed().subscribe( () => {
      dialogRef.close(this.filterData);
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
      name: this._filter.fl,
      checkCollectFilter: this.checkCollectFilter(),
      filterData: this.collect()
    })
  }

  checkCollectFilter()
  {
    return this._filter.checkCollectFilter([
      this.dates,
      this.selectedAffiliate,
      this.selectedPartner,
      this.selectedCountry,
      this.selectedStatus,
      this.selectedBroker,
      this.selectedLanguage,
      this.selectedTeam,
      this.selectedPixel,
      this.selectedDomain,
      this.selectedCampaign,
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
      { name: 'partner', selected: this.selectedPartner, list: this.partners },
      { name: 'broker', selected: this.selectedBroker, list: this.brokers },
      { name: 'language', selected: this.selectedLanguage, list: this.languages },
      { name: 'team', selected: this.selectedTeam, list: this.teams },
      { name: 'campaign', selected: this.selectedCampaign, list: this.campaigns },
      { name: 'affiliate', selected: this.selectedAffiliate, list: this.affiliates },
      { name: 'pixel', selected: this.selectedPixel, list: this.pixeles },
      { name: 'domain', selected: this.selectedDomain, list: this.domains },
    ]);
  }

  accept()
  {
    let filterData = this.collect()
    localStorage.setItem(this._filter.flc, JSON.stringify(this.collect()))
    this.dialogRef.close(filterData);
  }

  returnCurrentFilter(filter)
  {
    this.savedFilters = filter
  }

  returnDate(data)
  {
    this.date.patchValue({ start: data.start })
    this.date.patchValue({ end: data.end })

    this.updateDate()
    this.update()
    this.getFilterList()
  }

  returnSelect(data)
  {
    if( data.name == 'status' ) { this.selectedStatus = data.selected }
    if( data.name == 'country' ) { this.selectedCountry = data.selected }
    if( data.name == 'domain' ) { this.selectedDomain = data.selected }
    if( data.name == 'campaign' ) { this.selectedCampaign = data.selected }
    if( data.name == 'pixel' ) { this.selectedPixel = data.selected }
    if( data.name == 'affiliate' ) { this.selectedAffiliate = data.selected }
    if( data.name == 'team' ) { this.selectedTeam = data.selected }
    if( data.name == 'partner' ) { this.selectedPartner = data.selected }
    
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

    this._other.getFilterList(date).then((result:any) => 
    { 
      this.countries = this._other.fixList(result.country)
      this.campaigns = this._other.fixList(result.campaign)
      this.domains = this._other.fixList(result.domain)
      this.languages = this._other.fixList(result.language)
      this.partners = this._other.fixList(result.partner)
      this.pixeles = this._other.fixList(result.pixel)
      this.statuses = this._other.fixList(result.status)
      this.teams = this._other.fixList(result.team)
      this.affiliates = this._other.fixList(result.user)

      this.filteredAffiliates.next(this.affiliates.slice());
      this.filteredCountries.next(this.countries.slice());
      this.filteredCampaings.next(this.campaigns.slice());
      this.filteredPartners.next(this.partners.slice());
      this.filteredStatuses.next(this.statuses.slice());
      this.filteredDomains.next(this.domains.slice());
      this.filteredPixeles.next(this.pixeles.slice());
      
      this.inputStatusSelect.next({ name: 'status', list: this.statuses.slice() })
      this.inputCountrySelect.next({ name: 'country', list: this.countries.slice() })
      this.inputDomainSelect.next({ name: 'domain', list: this.domains.slice() })
      this.inputCampaignSelect.next({ name: 'campaign', list: this.campaigns.slice() })
      this.inputPixelSelect.next({ name: 'pixel', list: this.pixeles.slice() })
      this.inputAffiliateSelect.next({ name: 'affiliate', list: this.affiliates.slice() })
      this.inputTeamSelect.next({ name: 'team', list: this.teams.slice() })
      this.inputPartnerSelect.next({ name: 'partner', list: this.partners.slice() })
    }, () => {
      this.filteredAffiliates.next([]);
      this.filteredCountries.next([]);
      this.filteredCampaings.next([]);
      this.filteredPartners.next([]);
      this.filteredStatuses.next([]);
      this.filteredDomains.next([]);
      this.filteredPixeles.next([]);
      
      this.inputStatusSelect.next({ name: 'status', list: [] })
      this.inputCountrySelect.next({ name: 'country', list: [] })
      this.inputDomainSelect.next({ name: 'domain', list: [] })
      this.inputCampaignSelect.next({ name: 'campaign', list: [] })
      this.inputPixelSelect.next({ name: 'pixel', list: [] })
      this.inputAffiliateSelect.next({ name: 'affiliate', list: [] })
      this.inputTeamSelect.next({ name: 'team', list: [] })
      this.inputPartnerSelect.next({ name: 'partner', list: [] })

    }).finally(() => 
    {
      this.isLoading = false
    })
  }

  getCurrentFilter()
  {
    let filterStorage = localStorage.getItem(this._filter.flc);

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

        const domain = this._filter.check(this.savedFilters, 'domain', this.inputDomainSelect)

        if( domain )
        {
          this.selectedDomain = domain.selected
          this.inputDomainSelect = domain.input
        }

        const campaign = this._filter.check(this.savedFilters, 'campaign', this.inputCampaignSelect)

        if( campaign )
        {
          this.selectedCampaign = campaign.selected
          this.inputCampaignSelect = campaign.input
        }

        const pixel = this._filter.check(this.savedFilters, 'pixel', this.inputPixelSelect)

        if( pixel )
        {
          this.selectedPixel = pixel.selected
          this.inputPixelSelect = pixel.input
        }

        const affiliate = this._filter.check(this.savedFilters, 'affiliate', this.inputAffiliateSelect)

        if( affiliate )
        {
          this.selectedAffiliate = affiliate.selected
          this.inputAffiliateSelect = affiliate.input
        }

        const team = this._filter.check(this.savedFilters, 'team', this.inputTeamSelect)

        if( team )
        {
          this.selectedTeam = team.selected
          this.inputTeamSelect = team.input
        }

        const partner = this._filter.check(this.savedFilters, 'partner', this.inputPartnerSelect)

        if( partner )
        {
          this.selectedPartner = partner.selected
          this.inputPartnerSelect = partner.input
        }
      }

      this.updateDate()
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
