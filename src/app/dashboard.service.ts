import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url: string = environment.serverBaseURL;

  _searchValue = new BehaviorSubject<any>([]);
  searchValue$: Observable<any>;

  constructor(private http: HttpClient) {
    this.searchValue$ = this._searchValue.asObservable();
   }

  getList(pageSize: number, pageIndex: number, order: number, asc: boolean, facets, searchInput?) {
    // tslint:disable:max-line-length
    let searchString = '';
    if (searchInput !== undefined  && searchInput['value'] !== '' && searchInput !== [] && searchInput.length !== 0) {
      searchString = searchInput['value'];
    }
    return this.http.get(this.url + '/list?size=' + pageSize + '&page=' + (pageIndex + 1) + '&order=' + order + '&asc=' + asc + this.makeFacetString(facets) + encodeURIComponent(searchString));
  }

  getFacets(category: string, num: number, facets, searchInput?) {
    let searchString = '';
    if (searchInput !== undefined && searchInput['value'] !== '' && searchInput !== [] && searchInput.length !== 0) {
      searchString = searchInput['value'];
    }
    return this.http.get(this.url + '/facet?maxFacetOptions=' + num * 5 + '&facet=' + category + this.makeFacetString(facets, category) + encodeURIComponent(searchString));
  }

  getAutocompleteList(text: string) {
    return this.http.get(this.url + '/list?size=15&page=1&text=' + encodeURIComponent(text));
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
}
