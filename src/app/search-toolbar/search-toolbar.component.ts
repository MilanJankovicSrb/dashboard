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

  constructor(private service: DashboardService) { }

  ngOnInit() {
    this.value.valueChanges
      .pipe(
        debounceTime(300)
      ).subscribe(res => {
        if (res.length > 2) {
          this.service.getAutocompleteList(res).subscribe(response => {
            this.autocompleteList = response['data'];
          });
        } else {
          this.autocompleteList = [];
        }
      });
  }

  cleanValue() {
    this.value.setValue('');
  }

  selectOption(slicedSearch: string, fullSearch: string) {
    const temp = {'value': slicedSearch, 'descr': fullSearch};
    this.service.setValueSearch(temp);
  }
}
