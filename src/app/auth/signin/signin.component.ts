import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signInForm:FormGroup;
  errorMessage:string;

  constructor(private formbuilder:FormBuilder,
              private authservice:AuthService,
              private router:Router) { }

  ngOnInit() {
    this.initForm();
  }
  initForm(){
    this.signInForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }
  onSubmit(){
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;
    this.authservice.SignInUser(email, password).then(
      () =>{
        this.router.navigate(['/books'])
      },
      (error) =>{
        this.errorMessage = error;
      }
    )
  }

}
