import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserAccount } from '../user.account.provider';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public viewMode = ViewMode.Step1;

  public verify_password;

  constructor(
      private router: Router,
      public alertController: AlertController,
      public toastController: ToastController,
      private account: UserAccount
  ) { }

  async ionViewCanEnter(): Promise<any> {
    return await this.account.init();
  }

  async ngOnInit(): void {
    return await this.account.clear();
  }

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
    if (this.viewMode === ViewMode.Step1 && viewMode === ViewMode.Step2) {
      if (!this.account.user.email) {
        await this.displayEmptyEmailAlert();
      } else if (!this.account.user.password) {
        await this.displayEmptyPasswordAlert();
      } else if (this.account.user.password !== this.verify_password) {
        await this.displayPasswordMismatchAlert();
      } else {
        this.viewMode = ViewMode.Step2;
      }
    } else if (this.viewMode === ViewMode.Step2 && viewMode === ViewMode.Step1) {
      this.viewMode = ViewMode.Step1;
    }
  }

  async createUser() {
    try {
      await this.account.createUser();
      await this.displayUserRegisteredToast();
      await this.router.navigateByUrl('/');
    } catch (e) {
      await this.displayUserRegistrationFailedError();
    }
  }

}

enum ViewMode {
  Step1 = 1,
  Step2,
}
