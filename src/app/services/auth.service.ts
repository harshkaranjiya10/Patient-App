import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface signup_sendotp {
    apikey: string,
    firstname: string,
    mobile: string,
    password: string
}
interface OtpResponse {
  status_code: string,
  status_message: string
}
interface Patient {
  patient_id: string,
    status: string,
    accesstoken: string,
    profile_picture: string
    firstname: string,
    lastname: string,
    patient_code: string,
    zipcode: string
}
interface loginResponse {
  status_code: string,
  status_message: string,
  data : {
    patient_id: string,
      status: string,
      accesstoken: string,
      profile_picture: string
      firstname: string,
      lastname: string,
      patient_code: string,
      zipcode: string
  },
} 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticated = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.authenticated.next(true);
    }
  }

  // Otp Requests
  otpRequest(obj: any) {
    return this.http.post<OtpResponse>('https://dev-api.evitalrx.in/v1/patient/login/signup_sendotp', {...obj, apikey: "I8JElvKBFFg8rMpOteYljU7w5nqH5dKP"})
  }
  
  // Signup
  signup(obj: any) {
    return this.http.post<loginResponse>('https://dev-api.evitalrx.in/v1/patient/login/signup', {...obj, apikey: "I8JElvKBFFg8rMpOteYljU7w5nqH5dKP"}).pipe(
      tap((res) => {
        if (res.status_code === '1' && res.data.accesstoken) {
          this.authenticated.next(true);
          localStorage.setItem('token', res.data.accesstoken);
        }
      })
    );
  }

  //Login
  login(obj: any) {
    return this.http.post<loginResponse>('https://dev-api.evitalrx.in/v1/patient/login', {...obj, apikey: "I8JElvKBFFg8rMpOteYljU7w5nqH5dKP"}).pipe(
      tap((res)=> {
        if (res.status_code === '1' && res.data.accesstoken) {
          this.authenticated.next(true);
          localStorage.setItem('token', res.data.accesstoken);
        }
      })
    )
  }

  //Logout
  logout() {
    this.authenticated.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    this.router.navigate(['/login']);
  }
}
