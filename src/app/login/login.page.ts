import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { UserAccount } from '../signup/user.account';

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
      public toastController: ToastController
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
          this.displayAuthSuccessfulToast();
        })
        .catch(error => {
          this.displayAuthFailureAlert();
        });
  }
}
