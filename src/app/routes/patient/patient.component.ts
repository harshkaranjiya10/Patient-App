import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { PatientService } from '../../services/patient.service';
import { first } from 'rxjs';
@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    MatListModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
})
export class PatientComponent {
  patients: any = [];
  submitted = false;
  userDataForm = new FormGroup({
    zipcode: new FormControl(''),
    blood_group: new FormControl(''),
    patient_id: new FormControl(''),
    gender: new FormControl(''),
    dob: new FormControl(''),
  });
  invalid = false;
  error = '';
  private _bottomSheetRef =
    inject<MatBottomSheetRef<PatientComponent>>(MatBottomSheetRef);
  update = false;
  patientData: any;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public patient: any,
    private patientService: PatientService
  ) {
    let patientStorage = localStorage.getItem('patient');
      if (patientStorage) {
        this.patientData = JSON.parse(patientStorage);
      }
  }
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  onSubmit(event: MouseEvent) {
    this.submitted = true;
    if (this.userDataForm.invalid) {
      console.log('Invalid');
      return;
    }

    const patientDetails = {
      zipcode: this.userDataForm.value.zipcode,
      gender: this.userDataForm.value.gender,
      dob: this.userDataForm.value.dob,
      blood_group: this.userDataForm.value.blood_group,
      apikey: 'I8JElvKBFFg8rMpOteYljU7w5nqH5dKP',
      first_name: this.patientData.firstname,
      last_name: this.patientData.lastname,
      patient_id: this.patientData.patient_id,
    };

    console.log(patientDetails);
    this.patientService
      .postUpdateData(patientDetails)
      .subscribe((res: any) => {
        if (res.status_code === '1') {
          alert('patient_id: ' + res.data.patient_id);
          this._bottomSheetRef.dismiss();
          event.preventDefault();
        } else {
          this.invalid = true;
          this.error = res.status_message;
          alert(res.status_message);
        }
      });
    console.log(this.userDataForm);
  }
  onClose(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
    console.log(this.userDataForm);
  }
  ngOnInit(): void {
    if (this.patient) {
      Object.keys(this.userDataForm.controls).forEach((key) => {
        if (this.patient[key]) {
          this.userDataForm.get(key)?.setValue(this.patient[key]);
        }
      });
    }
  }
}
