import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { UserAccount } from '../user.account.provider';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  public viewMode = ViewMode.Step1;

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

  async displayUserRegisteredToast() {
    const toast = await this.toastController.create({
      message: 'Your account has been successfully created!',
      duration: 2000
    });

    toast.present();
  }

  async displayUserRegistrationFailedError() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Registration Failed',
      message: 'Account with specified username/email already exists!',
      buttons: ['OK']
    });

    await alert.present();
  }

  async setViewMode(viewMode) {
    if (this.viewMode == ViewMode.Step1 && viewMode == ViewMode.Step2) {
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
        this.viewMode = ViewMode.Step2;
      }
    }
    else if (this.viewMode == ViewMode.Step2 && viewMode == ViewMode.Step1) {
      this.viewMode = ViewMode.Step1;
    }
  }

  constructor(
      public alertController: AlertController,
      public toastController: ToastController,
      private user_account: UserAccount
  ) { }

  createUser() {
    this.user_account.createUser()
        .then(data => {
          this.displayUserRegisteredToast();
        })
        .catch(error => {
          this.displayUserRegistrationFailedError();
        });
  }
}

enum ViewMode {
  Step1 = 1,
  Step2,
}
