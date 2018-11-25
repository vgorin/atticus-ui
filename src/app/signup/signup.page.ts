import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})
export class SignupPage implements OnInit {
  public step: number = 1;

  public email: string;
  public password: string;
  public verifyPassword: string;

  public name: string;
  public username: string;

  constructor() { }

  ngOnInit() {
  }

}
