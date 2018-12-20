import { FormControl } from '@angular/forms';
import { DashboardService, /* DataItem */ } from './../dashboard.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { PageEvent, MatPaginator } from '@angular/material';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy, AfterViewChecked {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  // tslint:disable:max-line-length
  // CHART VARIABLES
  /* dataSource: DataItem[];
  colors: string[];
  isFirstLevel: boolean; */
  // CHART VARIABLES

  length = 100;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200];
  pageEvent: PageEvent;
  activePageDataChunk = [];

  @ViewChild(CdkVirtualScrollViewport) scroll: CdkVirtualScrollViewport;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  facetCategories: Array<Object> = [
    { code: 'cdc', descr: 'CdC' , icon: 'sitemap'},
    { code: 'rcdc', descr: 'Resp. CdC' , icon: 'visibility'},
    { code: 'amt', descr: 'Importo' , icon: 'euro_symbol'},
    { code: 'snd', descr: 'Seconda Firma' , icon: 'done_all'},
    { code: 'soc', descr: 'Societa' , icon: 'business'},
    { code: 'mon', descr: 'Mese' , icon: 'date_range'},
    { code: 'lav', descr: 'Lavoratore' , icon: 'person_outline'}
  ];
  facetOptions: Object = {};
  ascending: boolean = true;

  orderBy = new FormControl(1);

  selectedFacets = [];
  chosenFilters = [];

  numMore = [];
  hasMore = [];

  searchText;

  loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;


  constructor(private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private service: DashboardService/* , element: ElementRef */) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    for (const i of this.facetCategories) {
      this.selectedFacets[i['code']] = [];
      this.numMore[i['code']] = 1;
    }

    /* this.dataSource = service.filterData(""); */
    /* this.colors = service.getColors();
    this.isFirstLevel = true; */
  }

  ngOnInit(): void {
    this.service.searchValue$.subscribe(res => {
      this.searchText = res;
      this.moveToChosen(res, 'note', 'comment');
      this.loadList(this.pageSize, this.pageIndex);
      this.loadFacets();
    });
    this.service.searchFilter$.subscribe(respond => {
      if (respond.length !== 0) {
        const index = this.selectedFacets[respond['cat']].indexOf(respond['code']);
        if (index === -1) {
          this.selectedFacets[respond['cat']].push(respond['code']);
          const iconIndex = this.facetCategories.findIndex(i => i['code'] === respond['cat']);
          this.moveToChosen(respond, respond['cat'], this.facetCategories[iconIndex]['icon']);
          this.loadList(this.pageSize, this.pageIndex);
          this.loadFacets();
        }
      }
    });
    this.loadList(this.pageSize, this.pageIndex);
    this.loadFacets();
  }

  // CHART METHODES
  /* onButtonClick() {
    if (!this.isFirstLevel) {
        this.isFirstLevel = true;
        this.dataSource = this.service.filterData("");
    }
  }

  onPointClick(e) {
      if (this.isFirstLevel) {
          this.isFirstLevel = false;
          this.dataSource = this.service.filterData(e.target.originalArgument);
      } else {
        console.log(e);
      }
  }

  customizePoint = () => {
      let pointSettings: any;

      pointSettings = {
          color: this.colors[Number(this.isFirstLevel)]
      };

      if (!this.isFirstLevel) {
          pointSettings.hoverStyle = {
              hatching: "none"
          };
      }

      return pointSettings;
  } */

  // CHART METHODES



  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  onPageChanged(event) {
    this.pageSize = event.pageSize;
    this.loadList(event.pageSize, event.pageIndex);
  }

  loadList(size: number, index: number) {
    this.loading = true;
    this.service.getList(size, index, this.orderBy.value, this.ascending, this.selectedFacets, this.searchText).subscribe(res => {
      this.activePageDataChunk = res['data'];
      this.length = res['count'];
      this.scroll.scrollToIndex(0);
      this.loading = false;
    });
  }

  loadFacets() {
    for (const entry of this.facetCategories) {
        this.service.getFacets(entry['code'], this.numMore[entry['code']], this.selectedFacets, this.searchText).subscribe(response => {
          this.facetOptions[entry['code']] = response['facetOptions'];
          this.hasMore[entry['code']] = response['hasMore'];
          /* if (entry['code'] === 'mon') {
            let temp: DataItem[] = [];
            for (const item of this.facetOptions[entry['code']]) {
              let tempObject = { arg: item['code'], val: item['count'], parentID: '' };
              temp.push(tempObject);
            }
            this.dataSource = temp;
          } */
        });
    }
  }

  isSelected(category: string, code: string) {
    const index = this.selectedFacets[category].indexOf(code);
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  }

  selectFacet(category: string, code: string) {
    const index = this.selectedFacets[category].indexOf(code);
    if (index === -1) {
      this.selectedFacets[category].push(code);
    } else {
      this.selectedFacets[category].splice(index, 1);
    }
    this.pageIndex = 0;
    this.paginator.pageIndex = 0;
    this.loadList(this.pageSize, this.pageIndex);
    this.loadFacets();
  }

  deselectFacet(item) {
    const index = this.chosenFilters.findIndex(i => i.code === item.code);
    if (index !== -1) {
      this.chosenFilters.splice(index, 1);
    }
    if (item.cat !== 'note') {
      const indexInSelected = this.selectedFacets[item.cat].indexOf(item.code);
      if (indexInSelected !== -1) {
        this.selectedFacets[item.cat].splice(indexInSelected, 1);
      }
    } else {
      this.searchText = '';
    }
    this.loadList(this.pageSize, this.pageIndex);
    this.loadFacets();
  }

  moveToChosen(item, cat, icon) {
    const index = this.chosenFilters.findIndex(i => i.code === item.code);
    if (index === -1) {
      if (!(cat === 'note' && item.descr === undefined)) {
        this.chosenFilters.push({'cat': cat, 'icon': icon, 'descr' : item.descr, 'code': item.code});
      }
    } else {
      this.chosenFilters.splice(index, 1);
    }
  }

  trackByFn(index, item) {
    return index;
  }

  showMore(more: boolean, cat: string) {
    if (more) {
      ++this.numMore[cat];
    } else {
      this.numMore[cat] = 1;
    }
    this.service.getFacets(cat, this.numMore[cat], this.selectedFacets, this.searchText).subscribe(res => {
      this.facetOptions[cat] = res['facetOptions'];
        this.hasMore[cat] = res['hasMore'];
    });
  }

  resetAll() {
    for (const i of this.facetCategories) {
      this.selectedFacets[i['code']] = [];
      this.numMore[i['code']] = 1;
    }
    this.chosenFilters = [];
    this.searchText = '';
    this.loadList(this.pageSize, this.pageIndex);
    this.loadFacets();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
