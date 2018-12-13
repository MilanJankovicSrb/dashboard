import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatSidenavModule,
  MatListModule,
  MatPaginatorModule,
  MatSelectModule,
  MatExpansionModule,
  MatDialogModule,
  MatAutocompleteModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatSelectModule,
    MatExpansionModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatSelectModule,
    MatExpansionModule,
    MatDialogModule,
    MatAutocompleteModule
  ]
})
export class MaterialModule {}
