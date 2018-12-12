import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url: string = environment.serverBaseURL;

  constructor(private http: HttpClient) { }

  getList(pageSize: number, pageIndex: number, order: number, asc: boolean) {
    return this.http.get(this.url + '/list?size=' + pageSize + '&page=' + (pageIndex + 1) + '&order' + order + '&asc=' + asc);
  }

  getFacets(category: string, num: number) {
    return this.http.get(this.url + '/facet?maxFacetOptions=' + num * 5 + '&facet=' + category);
  }
}
