import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

/* export class DataItem {
  arg: string;
  val: number;
  parentID: string;
}

const data: DataItem[] = [
  { arg: "2010", val: 5678, parentID: "" },
  { arg: "2011", val: 7239, parentID: "" },
  { arg: "2012", val: 400, parentID: "" },
  { arg: "2013", val: 223, parentID: "" },
  { arg: "2014", val: 11000, parentID: "" },
  { arg: "2015", val: 1345, parentID: "" },
  { arg: "2016", val: 888, parentID: "" },
  { arg: "2017", val: 235, parentID: "" },
  { arg: "2018", val: 12, parentID: "" },
  { arg: "Gen", val: 100, parentID: "2010" },
  { arg: "Feb", val: 101, parentID: "2010" },
  { arg: "Mar", val: 105, parentID: "2010" },
  { arg: "Apr", val: 92, parentID: "2010" },
  { arg: "Mag", val: 31, parentID: "2010" },
  { arg: "Giu", val: 51, parentID: "2010" },
  { arg: "Lug", val: 63, parentID: "2010" },
  { arg: "Ag", val: 22, parentID: "2010" },
  { arg: "Set", val: 74, parentID: "2010" },
  { arg: "Ott", val: 455, parentID: "2010" },
  { arg: "Nov", val: 235, parentID: "2010" },
  { arg: "Dic", val: 24, parentID: "2010" },
  { arg: "Gen", val: 1300, parentID: "2011" },
  { arg: "Feb", val: 1011, parentID: "2011" },
  { arg: "Mar", val: 1045, parentID: "2011" },
  { arg: "Apr", val: 952, parentID: "2011" },
  { arg: "Mag", val: 371, parentID: "2011" },
  { arg: "Giu", val: 851, parentID: "2011" },
  { arg: "Lug", val: 693, parentID: "2011" },
  { arg: "Ag", val: 202, parentID: "2011" },
  { arg: "Set", val: 774, parentID: "2011" },
  { arg: "Ott", val: 1455, parentID: "2011" },
  { arg: "Nov", val: 2235, parentID: "2011" },
  { arg: "Dic", val: 243, parentID: "2011" },
];

const colors: string[] = ["#0278bdba", "#0278bdba"]; */

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url: string = environment.serverBaseURL;

  _searchValue = new BehaviorSubject<any>([]);
  searchValue$: Observable<any>;

  _searchFilter = new BehaviorSubject<any>([]);
  searchFilter$: Observable<any>;

  constructor(private http: HttpClient) {
    this.searchValue$ = this._searchValue.asObservable();
    this.searchFilter$ = this._searchFilter.asObservable();
   }

   /* filterData(name): DataItem[] {
    return data.filter(function (item) {
        return item.parentID === name;
    });
  }

  getColors(): string[] {
      return colors;
  } */

  getList(pageSize: number, pageIndex: number, order: number, asc: boolean, facets, searchInput?) {
    // tslint:disable:max-line-length
    let searchString = '';
    if (searchInput !== undefined  && searchInput['value'] !== '' && searchInput !== [] && searchInput.length !== 0) {
      searchString = '&text='  + encodeURIComponent(searchInput['value']);
    }
    return this.http.get(this.url + '/list?size=' + pageSize + '&page=' + (pageIndex + 1) + '&order=' + order + '&asc=' + asc + this.makeFacetString(facets) + searchString);
  }

  getFacets(category: string, num: number, facets, searchInput?) {
    let searchString = '';
    if (searchInput !== undefined && searchInput['value'] !== '' && searchInput !== [] && searchInput.length !== 0) {
      searchString = '&text='  + encodeURIComponent(searchInput['value']);
    }
    return this.http.get(this.url + '/facet?facetMaxOptions=' + num * 5 + '&facet=' + category + this.makeFacetString(facets, category) + searchString);
  }

  getAutocompleteList(text: string) {
    return this.http.get(this.url + '/list?size=5&page=1&text=' + encodeURIComponent(text));
  }

  getCdcAutocompleteList(text: string) {
    return this.http.get(this.url + '/facet?facetMaxOptions=5&facet=cdc&cdcText=' + encodeURIComponent(text));
  }

  makeFacetString(facets, category?) {
    let facetString = '';
    Object.entries(facets).forEach(
      ([key1, value1]) => {
          if (category === undefined || category !== key1) {
            Object.entries(value1).forEach(
              ([key2, value2]) => {
                facetString = facetString.concat('&', key1, '=', encodeURIComponent(value2.toString()));
              }
            );
          }
        }
    );
    return facetString;
  }

  setValueSearch(value) {
    this._searchValue.next(value);
  }

  setFilterSearch(value) {
    this._searchFilter.next(value);
    console.log(this._searchFilter);
  }
}
