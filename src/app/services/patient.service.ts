import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
      const patient = localStorage.getItem('patient');
      if (patient) {
        this.authService.authenticated.next(true);
      }
    }

    postUpdateData(obj: any) {
      return this.http.post('https://dev-api.evitalrx.in/v1/patient/patients/update', obj);
    }
  }

