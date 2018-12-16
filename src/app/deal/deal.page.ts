import { Component, OnInit } from '@angular/core';
import { UserAccount } from '../user.account.provider';

@Component({
  selector: 'app-deal',
  templateUrl: './deal.page.html',
  styleUrls: ['./deal.page.scss'],
})
export class DealPage implements OnInit {
  public viewMode: ViewMode = ViewMode.DealView;

  public deal;

  constructor(private account: UserAccount) {
    this.deal = {};
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
      await this.account.openCounter();
      this.viewMode = ViewMode.CounterView;
    } catch (err) {
      this.displayError(err, 'Send counter error!');
    }
  }

  async sendCounter() {
    try {
      await this.account.sendCounter();
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
}

enum ViewMode {
  DealView = 1,
  ModalProposalSigned,
  ModalProposalDeclined,
  CounterView,
  ModalCounterSent
}
