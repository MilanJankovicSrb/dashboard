import { debounceTime } from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {DashboardService,/* DataItem */} from './../dashboard.service';
import {Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked, ViewChild, EventEmitter} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {PageEvent, MatPaginator} from '@angular/material';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ngxLoadingAnimationTypes} from 'ngx-loading';
import { Options, ChangeContext, PointerType } from 'ng5-slider';
import { Subject } from 'rxjs';

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

  minValue: number = 0;
  maxValue: number = 5000;
  manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  options: Options = {
    floor: 0,
    ceil: 5000,
    step: 50,
    minRange: 1,
    pushRange: true,
    showTicks: true,
    stepsArray: [
      {value: 0},
      {value: 50, legend: '50€'},
      {value: 250, legend: '250€'},
      {value: 500, legend: '500€'},
      {value: 1000, legend: '1000€'},
      {value: 5000}
    ],
    noSwitching: true,
    translate: (value: number): string => {
      return '€' + value;
    },
    combineLabels: (minValue: string, maxValue: string): string => {
      return 'tra ' + minValue + ' e ' + maxValue;
    }
  };

  // CHART VARIABLES

  length = 100;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200];
  pageEvent: PageEvent;
  activePageDataChunk = [];

  @ViewChild(CdkVirtualScrollViewport) scroll: CdkVirtualScrollViewport;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  $amountRange: Subject<string[]> = new Subject<string[]>();

  facetCategories: Array < Object > = [{
      code: 'cdc',
      descr: 'CdC',
      icon: 'sitemap'
    },
    {
      code: 'rcdc',
      descr: 'Resp. CdC',
      icon: 'visibility'
    },
    {
      code: 'amt',
      descr: 'Importo',
      icon: 'euro_symbol'
    },
    {
      code: 'snd',
      descr: 'Seconda Firma',
      icon: 'done_all'
    },
    {
      code: 'soc',
      descr: 'Societa',
      icon: 'business'
    },
    {
      code: 'mon',
      descr: 'Mese',
      icon: 'date_range'
    },
    {
      code: 'lav',
      descr: 'Lavoratore',
      icon: 'person_outline'
    }
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


  constructor(private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private service: DashboardService /* , element: ElementRef */ ) {
    this.mobileQuery = media.matchMedia('(max-width: 701px)');
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
    this.$amountRange.pipe(debounceTime(300)).subscribe(res => {
      this.selectedFacets['amt'] = res;
      const tempItem = { code: 'amt', descr: 'Tra ' + this.minValue + '€ e ' + this.maxValue + '€'};
      this.moveToChosen(tempItem, 'amt', 'euro_symbol');
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

  onUserChangeEnd() {
    const temp: string[] = [];
    switch (this.minValue + '-' + this.maxValue) {
      case '0-50': {
        temp.push('0');
        break;
      }
      case '0-250': {
        temp.push('0', '1');
        break;
      }
      case '0-500': {
        temp.push('0', '1', '2');
        break;
      }
      case '0-1000': {
        temp.push('0', '1', '2', '3');
        break;
      }
      case '0-5000': {
        temp.push('0', '1', '2', '3', '4');
        break;
      }
      case '50-250': {
        temp.push('1');
        break;
      }
      case '50-500': {
        temp.push('1', '2');
        break;
      }
      case '50-1000': {
        temp.push('1', '2', '3');
        break;
      }
      case '50-5000': {
        temp.push('1', '2', '3', '4');
        break;
      }
      case '250-500': {
        temp.push('2');
        break;
      }
      case '250-1000': {
        temp.push('2', '3');
        break;
      }
      case '250-5000': {
        temp.push('2', '3', '4');
        break;
      }
      case '500-1000': {
        temp.push('3');
        break;
      }
      case '500-5000': {
        temp.push('3', '4');
        break;
      }
      case '1000-5000': {
        temp.push('4');
        break;
      }
  }
  this.$amountRange.next(temp);
}

  /* getChangeContextString(changeContext: ChangeContext): string {
    return `{pointerType: ${changeContext.pointerType === PointerType.Min ? 'Min' : 'Max'}, ` +
           `value: ${changeContext.value}, ` +
           `highValue: ${changeContext.highValue}}`;
  } */
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
    if (item.cat !== 'note' && item.cat !== 'amt') {
      const indexInSelected = this.selectedFacets[item.cat].indexOf(item.code);
      if (indexInSelected !== -1) {
        this.selectedFacets[item.cat].splice(indexInSelected, 1);
      }
    } else if (item.cat === 'note') {
      this.searchText = '';
    } else if (item.cat === 'amt') {
      this.selectedFacets['amt'] = [];
      this.minValue = 0;
      this.maxValue = 5000;
      this.manualRefresh.emit();
    }
    this.loadList(this.pageSize, this.pageIndex);
    this.loadFacets();
  }

  moveToChosen(item, cat, icon) {
    const index = this.chosenFilters.findIndex(i => i.code === item.code);
    if (index === -1) {
      if (!(cat === 'note' && item.descr === undefined)) {
        this.chosenFilters.push({
          'cat': cat,
          'icon': icon,
          'descr': item.descr,
          'code': item.code
        });
      }
    } else {
      this.chosenFilters.splice(index, 1);
      if (cat === 'amt' && !(this.minValue === 0 && this.maxValue === 1500)) {
        this.chosenFilters.push({
          'cat': cat,
          'icon': icon,
          'descr': item.descr,
          'code': item.code
        });
      }
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
    this.minValue = 0;
    this.maxValue = 5000;
    this.manualRefresh.emit();
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
