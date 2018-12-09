import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.page.html',
  styleUrls: ['./new-contract.page.scss'],
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

  async proposeContract() {
    try {
      const contract = await this.account.addContract(this.memo, this.body, this.to);
      console.log('NewContractPage - addContract', contract);
      this.messageOk('Contract Successfully Added!');
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
      message: 'Contract creation error:' + msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() { }
}
