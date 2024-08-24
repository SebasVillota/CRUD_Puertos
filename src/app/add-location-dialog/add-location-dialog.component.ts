import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '../models/location.model';

@Component({
  selector: 'app-add-location-dialog',
  templateUrl: './add-location-dialog.component.html',
  styleUrls: ['./add-location-dialog.component.scss']
})
export class AddLocationDialogComponent {
  locationForm: FormGroup;
  types = ['puerto', 'aeropuerto']; // Añade esta línea
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddLocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Location
  ) {
    this.locationForm = this.fb.group({
      type: [data?.type || '', Validators.required],
      country: [data?.country || '', Validators.required],
      city: [data?.city || '', Validators.required],
      name: [data?.name || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.locationForm.valid) {
      this.dialogRef.close(this.locationForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  
}