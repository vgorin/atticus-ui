import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.page.html',
  styleUrls: ['./new-template.page.scss'],
})
export class NewContractPage implements OnInit {
  private memo: string;
  private body: string;
  private to: number;

  constructor(
      public toastController: ToastController,
      public alertController: AlertController,
      private account: UserAccountModule
  ) {}

  async proposeTemplate() {
    try {
      const template = await this.account.addTemplate(this.memo, this.body, this.to);
      console.log('NewContractPage - addContract', template);
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
