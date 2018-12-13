import { FormControl } from '@angular/forms';
import { DashboardService } from './../dashboard.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';
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

  length = 100;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200];
  pageEvent: PageEvent;
  activePageDataChunk = [];

  @ViewChild(CdkVirtualScrollViewport) scroll: CdkVirtualScrollViewport;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  facetCategories: Array<Object> = [
    { code: 'cdc', descr: 'Cost centre' , icon: 'sitemap'},
    { code: 'rcdc', descr: 'Responsible of the CC' , icon: 'visibility'},
    { code: 'amt', descr: 'Amount' , icon: 'euro_symbol'},
    { code: 'snd', descr: 'Second sign' , icon: 'done_all'},
    { code: 'soc', descr: 'Company' , icon: 'business'},
    { code: 'mon', descr: 'Year/Month' , icon: 'date_range'},
    { code: 'lav', descr: 'Worker' , icon: 'person_outline'}
  ];
  facetOptions: Object = {};
  ascending: boolean = true;

  orderBy = new FormControl(1);

  selectedFacets = [];

  numMore = [];
  hasMore = [];

  searchText;

  loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  constructor(private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private service: DashboardService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    for (const i of this.facetCategories) {
      this.selectedFacets[i['code']] = [];
      this.numMore[i['code']] = 1;
    }
  }

  ngOnInit(): void {
    this.service.searchValue$.subscribe(res => {
      this.searchText = res;
    });
    this.loadList(this.pageSize, this.pageIndex);
    this.loadFacets();
  }

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

  trackByFn(index, item) {
    return index;
  }

  showMore(more: boolean, cat: string) {
    if (more) {
      ++this.numMore[cat];
    } else {
      this.numMore[cat] = 1;
    }
    this.loadFacets();
  }

  resetAll() {
    for (const i of this.facetCategories) {
      this.selectedFacets[i['code']] = [];
      this.numMore[i['code']] = 1;
    }
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
