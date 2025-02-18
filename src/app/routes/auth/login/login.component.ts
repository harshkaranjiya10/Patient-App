import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../../../shared/ui/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLogin = true;
  isotp = false;
  error = "";
  ack = "";
  constructor(private router: Router, private authService: AuthService) {}
  login: any;
  loginForm = new FormGroup({
    mobile: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  signup:any;
  signupForm = new FormGroup({
    mobile: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
  });
  otpPasswordForm = new FormGroup({
    mobile: new FormControl(this.signupForm.value.mobile, [Validators.required]),
    firstname: new FormControl(this.signupForm.value.firstname, [Validators.required]),
    lastname: new FormControl(this.signupForm.value.lastname),
    otp: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required]),
  });
  
  onLoginSubmit() {
    console.log(this.loginForm.value);

    this.login = this.loginForm.value;
    const obj = {
      mobile: this.loginForm.value.mobile,
      password: this.loginForm.value.password
    };
    
    this.authService.login(obj).subscribe((res) => {
      console.log(res);
      if (res.status_code === '1') {
        this.signup = obj;
        this.isotp = true;
        this.error = '';
        this.ack = res.status_message;
        localStorage.setItem('token', res.data.accesstoken);
        
        this.router.navigate(['/medicines/get-inventory-items'])
      } else {
        this.error = res.status_message
      }
    });
    /* this.router.navigate(['/medicines/get-inventory-items']) */
  }
  onOtpRequest() {
    console.log(this.signupForm);
    if(this.signupForm.invalid) {
      this.error = 'Invalid Mobile or Name';
      return;
    } else {
      const obj = {
        mobile: this.signupForm.value.mobile,
        firstname: this.signupForm.value.firstname,
        lastname: this.signupForm.value.lastname,
      };
      this.authService.otpRequest(obj).subscribe((res) => {
        console.log(res);
        if (res.status_code === '1') {
          this.signup = obj;
          this.isotp = true;
          this.error = '';  
          this.ack = res.status_message;
        } else {
          this.error = res.status_message
        }
      });
    }
  }
  
  onOtpSubmit() {
    /* console.log(this.otpPasswordForm.value); */
    this.ack=''
    const obj = {
      ...this.signup,
      password: this.otpPasswordForm.value.password,
      otp: this.otpPasswordForm.value.otp
    };
    this.authService.signup(obj).subscribe((res) => {
      console.log(obj);
      
      console.log(res);
      if (res.status_code === '1') {
        this.isotp = true;
        this.error = ''
        this.ack = res.status_message;
        localStorage.setItem('token', res.data.accesstoken);
        this.router.navigate(['/medicines/get-inventory-items'])
      } else {
        this.error = res.status_message;
        console.log(res.status_message);
      }
    });
  }

  onClick() {
    this.isLogin = !this.isLogin;
    this.error = ''
  }
}
