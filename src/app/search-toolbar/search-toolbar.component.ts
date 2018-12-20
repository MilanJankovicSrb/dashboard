import { DashboardService } from './../dashboard.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.css']
})
export class SearchToolbarComponent implements OnInit {
  value = new FormControl('');
  autocompleteList = [];
  cdcAutocompleteList = [];
  searchColor: string;
  iconColor: string;

  constructor(private service: DashboardService) {
   }

  ngOnInit() {
    this.value.valueChanges
      .pipe(
        debounceTime(300)
      ).subscribe(res => {
        if (res.length > 2) {
          this.service.getAutocompleteList(res).subscribe(response => {
            this.autocompleteList = response['data'];
          });
          this.service.getCdcAutocompleteList(res).subscribe(respond => {
            this.cdcAutocompleteList = respond['facetOptions'];
          });
        } else {
          this.autocompleteList = [];
          this.cdcAutocompleteList = [];
        }
      });
  }

  cleanValue() {
    this.value.setValue('');
  }

  selectOption(slicedSearch: string, fullSearch: string) {
    const temp = {'code': 'note', 'value': slicedSearch, 'descr': fullSearch};
    this.service.setValueSearch(temp);
  }

  sendSelectedFacet(category: string, recCode: string, recDescr: string) {
    const temp = {cat: category, code: recCode, descr: recDescr};
    this.service.setFilterSearch(temp);
  }

  onFocus() {
    this.searchColor = 'white';
    this.iconColor = 'rgb(2, 119, 189)';
  }
  onFocusOut() {
    this.searchColor = 'rgb(2, 107, 170)';
    this.iconColor = 'white';
  }

  trackByFn(index, item) {
    return index;
  }
}
