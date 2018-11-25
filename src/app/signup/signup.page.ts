import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public step: number = 1;
  public user_account: object;
  private backend_url: string;

  async displayEmptyEmailAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Empty Email',
      message: 'Please provide your email address.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async displayEmptyPasswordAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Empty Password',
      message: 'Please fill in your password.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async displayPasswordMismatchAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Password Mismatch',
      message: 'Your password and confirmation password do not match.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async setStep(step) {
    if (this.step === 1 && step === 2) {
      if (!this.user_account.email) {
        await this.displayEmptyEmailAlert();
      }
      else if (!this.user_account.password) {
        await this.displayEmptyPasswordAlert();
      }
      else if (this.user_account.password !== this.user_account.verify_password) {
        await this.displayPasswordMismatchAlert();
      }
      else {
        this.step = 2;
      }
    }
    else if (this.step === 2 && step === 1) {
      this.step = 1;
    }
  }

  constructor(private http: HttpClient, public alertController: AlertController) {
    this.backend_url = 'http://192.168.1.236:8080';
    this.user_account = {
      country_code: 'US',
      language_code: 'eng',
      timezone: 'America/Los_Angeles'
    };
  }

  private _request(sub_url, method, json, options) {
    const url = [this.backend_url, sub_url].join('/')
        .replace(/([^:])\/{2,}/g, '$1/');
    let args = [url];
    if (!options) {
      options = {};
    }
    if (!options.headers) {
      options.headers = {};
    }
    if (!options.headers['Content-Type']) {
      options.headers['Content-Type'] = {};
    }
    options.headers['Content-Type'] = 'application/json';
    method = method.toLowerCase();
    switch (method) {
      case 'get' : {
        args = args.concat([options]);
        break;
      }
      case 'post' : {
        args = args.concat([json, options]);
        break;
      }
    }
    if (!this.http[method]) {
      console.log('Error: No such HTTP method :', {url, method, json, options});
    }
    return this.http[method].apply(this.http, args)
        .toPromise()
        .then((response) => {
          if ((response.error || {}).message) {
            throw new Error([
              response.error.code,
              response.error.message
            ].join(': '));
          }
          console.log('HTTP_RESPONSE:', {method, args, options, response});
          return response;
        })
        .catch((error) => {
          console.log('HTTP_ERROR:', { method, args, options, error });
        });
  }

  getUser() {
    const self = this;
    this._request('/account/1', 'get', null, null)
        .then(data => {
          self.user_account = Object.assign(self.user_account, data);
          self.user_account.password = '';
          self.user_account.verify_password = '';
        });
  }

  createUser() {
    const self = this;
    this._request('/account', 'post', this.user_account, null)
        .then(data => {
          self.user_account = Object.assign(self.user_account, data);
          self.user_account.password = '';
          self.user_account.verify_password = '';
        });
  }

  ngOnInit(): void {
  }
}
