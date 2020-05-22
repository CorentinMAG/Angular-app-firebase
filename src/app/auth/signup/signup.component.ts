import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm:FormGroup;
  errorMessage:string;

  constructor(private formbuilder:FormBuilder,
              private authservice:AuthService,
              private router:Router) { }

  ngOnInit() {
    this.initForm();
  }
  initForm(){
    this.signUpForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }
  onSubmit(){
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    this.authservice.createNewUser(email, password).then(
      () =>{
        this.router.navigate(['/books'])
      },
      (error) =>{
        this.errorMessage = error;
      }
    )
  }

}
