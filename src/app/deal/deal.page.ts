import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserAccount } from '../user.account.provider';

@Component({
  selector: 'app-deal',
  templateUrl: './deal.page.html',
  styleUrls: ['./deal.page.scss'],
})
export class DealPage implements OnInit {
  public viewMode: ViewMode = ViewMode.DealView;

  public deal;
  public counterContract;
  public _account_id;
  public _contracter_id;

  constructor(
      public alertController: AlertController,
      public toastController: ToastController,
      private account: UserAccount,
      private route: ActivatedRoute
  ) {
    this.deal = {};
    this.counterContract = {};
    this._account_id = this.route.snapshot.paramMap.get('account_id');
    this._contracter_id = this.route.snapshot.paramMap.get('contracter_id');
  }

  async ngOnInit() {
    await this.account.getDealToView();
    this.deal = this.account.dealToView;
    console.log("deal to view", this.deal);
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
      this.counterContract = await this.account.openCounter(this.deal);
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
      subHeader: header||err.message||err,
      message: err.message||err,
      buttons: ['OK']
    });

    await alert.present();
  }

  getDealSecondPartyName() {
    return this.account.getDealSecondPartyName(this.deal);
  }
}

enum ViewMode {
  DealView = 1,
  ModalProposalSigned,
  ModalProposalDeclined,
  CounterView,
  ModalCounterSent
}
