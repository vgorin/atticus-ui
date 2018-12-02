import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {UserAccount} from '../signup/user.account';
import {ToastController} from '@ionic/angular';

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
      public toastController: ToastController
  ) {
    this.account = new UserAccount(this.http);
  }

  async proposeContract() {
    console.log(this.user, this.memo, this.body, this.to);
    const contract = await this.account.addContract(this.user, this.memo, this.body, this.to);
    console.log('NewContractPage - addContract', contract);
    this.displayContractAdded();
  }

  async displayContractAdded() {
    const toast = await this.toastController.create({
      message: 'Contract Successfully Added!',
      duration: 2000
    });

    toast.present();
  }

  async ngOnInit() {
    const str = await this.storage.get('user');
    this.user = JSON.parse(str);
    console.log('NewContractPage-user', this.user);
  }
}
