import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.page.html',
  styleUrls: ['./new-template.page.scss'],
})
export class NewTemplatePage implements OnInit {
  private title: string;
  //private version: string;
  private body: string;

  constructor(
      public toastController: ToastController,
      public alertController: AlertController,
      private account: UserAccountModule
  ) {}

  async saveTemplate() {
    try {
      const template = await this.account.addTemplate(this.title, this.body);
      console.log('NewContractPage - addTemplate', template);
      this.messageOk('Template Successfully Added!');
    } catch (e) {
      console.log('error', e);
      this.messageFail( e.message || e );
    }
  }

  async messageOk(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });

    toast.present();
  }

  async messageFail(msg) {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Failed',
      message: 'Template creation error:' + msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() { }
}
