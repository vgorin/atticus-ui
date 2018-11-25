import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginPage } from "../login/login.page";

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
})
export class WelcomePage {
  constructor(private modal: ModalController) {

  }

  async openLoginModal() {
    console.log("welcome page openLoginModal()");

    const loginModal = await this.modal.create({
      component: LoginPage,
      componentProps: {}
    });

    await loginModal.present();
  }

}
