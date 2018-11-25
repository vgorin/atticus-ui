import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public step: number = 1;

  public accountId: number;

  public email: string;
  public password: string;
  public verifyPassword: string;

  public legalName: string;
  public username: string;

  public countryCode: string = "US";
  public languageCode: string = "eng";
  public timezone: string = "America/Los_Angeles";

  constructor(private http: HttpClient, public alertController: AlertController) {}

  async displayPasswordMismatchAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Password Mismatch',
      message: 'Your password and confirmation password do not match.',
      buttons: ['OK']
    });

    await alert.present();
  }

  getUser() {
    const url = 'http://192.168.1.236:8080/account/user/despotix';
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    this.http.get(url, options).subscribe(data => {
      console.log('my data: ', data);
    });

    const self = this;
    setTimeout((() => {
      console.log(this.accountId, self.accountId);
    }), 5555);
  }

  createUser() {
    console.log(1, this, arguments);

    const url = 'http://192.168.1.236:8080/account/user/despotix';
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const json = {
      account_id: 1,
      email: 'despotix3@gmail.com',
      username: 'Despotix3',
      password: 'test1',
      legal_name: 'Legal',
      language_code: 'eng',
      country_code: 'US',
      timezone: 'America/Los_Angeles'
    };
    this.http.post(url, json, options).subscribe(data => {
      console.log('my data: ', data);
    });

    const self = this;
    setTimeout((() => {
      console.log(this.accountId, self.accountId);
    }), 5555);
  }

  ngOnInit(): void {}
}
