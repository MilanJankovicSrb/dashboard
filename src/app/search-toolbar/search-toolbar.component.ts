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

  constructor() { }

  ngOnInit() {
      this.value.valueChanges
        .pipe(
          debounceTime(300)
        ).subscribe(res => {
          // call service code
        });
  }

  cleanValue() {
    this.value.setValue('');
  }
}
