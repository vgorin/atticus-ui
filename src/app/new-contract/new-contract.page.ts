import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {UserAccount} from '../signup/user.account';
import {AlertController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.page.html',
  styleUrls: ['./new-contract.page.scss'],
})
export class NewContractPage implements OnInit {
  private user: Object;
  private account: UserAccount;
  private memo: string;
  private body: string;
  private to: number;

  constructor(
      private storage: Storage,
      private http: HttpClient,
      public toastController: ToastController,
      public alertController: AlertController,
  ) {
    this.account = new UserAccount(this.http);
  }

  async proposeContract() {
    try {
      console.log(this.user, this.memo, this.body, this.to);
      const contract = await this.account.addContract(this.user, this.memo, this.body, this.to);
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

  async ngOnInit() {
    const str = await this.storage.get('user');
    this.user = JSON.parse(str);
    console.log('NewContractPage-user', this.user);
  }
}
