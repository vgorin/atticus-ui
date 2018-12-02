import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { UserAccount } from '../signup/user.account';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public user_account: UserAccount;

  constructor(
      private http: HttpClient,
      public modalController: ModalController,
      public alertController: AlertController,
      public toastController: ToastController,
      private router: Router,
      private storage: Storage
  ) {
    this.user_account = new UserAccount(this.http);
  }


  ngOnInit() {
  }

  dismiss() {
    console.log("login modal dismiss()");
    this.modalController.dismiss();
  }

  async displayAuthFailureAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Authorization Failed',
      message: 'No user with such combination of email/password found. Please verify your credentials.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async displayAuthSuccessfulToast() {
    const toast = await this.toastController.create({
      message: 'Authorization Successful!',
      duration: 2000
    });

    toast.present();
  }

  login() {
    this.user_account.getUser()
        .then(data => {
          //this.displayAuthSuccessfulToast();
          console.log('login - user - data', data);
          return this.storage.set('user', JSON.stringify(data));
        }).then( (key) => {
          return this.router.navigateByUrl('/contracts');
        })
        .catch(error => {
          this.displayAuthFailureAlert();
        });
  }
}
