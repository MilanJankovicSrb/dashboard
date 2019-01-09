import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface DialogData {
  expense: Object;
}

@Component({
  selector: 'app-showmore',
  templateUrl: './showmore.component.html',
  styleUrls: ['./showmore.component.css']
})
export class ShowmoreComponent implements OnInit {

  description: string;

  constructor(public dialogRef: MatDialogRef<ShowmoreComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
   }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
}

}
