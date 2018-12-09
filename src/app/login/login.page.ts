import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';
import { UserAccountModule } from '../user.account.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email: string;
  public password: string;

  constructor(
      public modalController: ModalController,
      public alertController: AlertController,
      public toastController: ToastController,
      private router: Router,
      public account: UserAccountModule
  ) { }

  ngOnInit() {
  }

  dismiss() {
    console.log('login modal dismiss()');
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
    return this.account.logIn(this.email, this.password)
        .then(data => {
          console.log('login - user - data', data);
          return this.displayAuthSuccessfulToast();
        }).then( (key) => {
          return this.router.navigateByUrl('/drafts');
        })
        .catch(error => {
          console.log('fail - login - user - data', error);
          return this.displayAuthFailureAlert();
        });
  }
}
