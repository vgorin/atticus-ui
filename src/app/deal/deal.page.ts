import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { UserAccount } from '../user.account.provider';

@Component({
  selector: 'app-deal',
  templateUrl: './deal.page.html',
  styleUrls: ['./deal.page.scss'],
})
export class DealPage implements OnInit {
  public viewMode: ViewMode = ViewMode.DealView;

  public counterContract;

  constructor(
      public alertController: AlertController,
      public toastController: ToastController,
      private account: UserAccount,
  ) {
    this.counterContract = {};
  }

  async ionViewCanEnter(): Promise<any> {
    return await this.account.init();
  }

  async ngOnInit() {
    await this.account.getDealToView();
    console.log('deal to view', this.account.dealToView);
  }

  async sign() {
    try {
      await this.account.dealAccept(this.deal);
      this.viewMode = ViewMode.ModalProposalSigned;
    } catch (err) {
      this.displayError(err, 'Signature error!');
    }
  }

  async openCounter() {
    try {
      this.counterContract = await this.account.openCounter(this.account.dealToView);
      this.viewMode = ViewMode.CounterView;
    } catch (err) {
      this.displayError(err, 'Send counter error!');
    }
  }

  async sendCounter() {
    try {
      await this.account.sendCounter(this.deal, this.counterContract);
      this.viewMode = ViewMode.ModalCounterSent;
    } catch (err) {
      this.displayError(err, 'Send counter error!');
    }
  }

  async displayError(err, header) {
    console.log('ERROR:', header, err);
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: header || err.message || err,
      message: err.message || err,
      buttons: ['OK']
    });

    await alert.present();
  }

  getDealSecondPartyName() {
    return this.account.getDealSecondPartyName(this.account.dealToView);
  }
}

enum ViewMode {
  DealView = 1,
  ModalProposalSigned,
  ModalProposalDeclined,
  CounterView,
  ModalCounterSent
}
