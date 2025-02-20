import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PatientComponent } from '../../../routes/patient/patient.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  patientProfile;
  constructor(public authService: AuthService) {
    const patient = localStorage.getItem('patient')
    if(patient) {
      this.patientProfile = JSON.parse(patient);
    }
  }

  logout() {
    this.authService.logout();
  }
  private _bottomSheet = inject(MatBottomSheet);

  profileUpdate() {
    this._bottomSheet.open(PatientComponent);
  }
}
