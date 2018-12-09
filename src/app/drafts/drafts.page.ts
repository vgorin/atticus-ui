import {Component, OnInit} from '@angular/core';
import { AlertController } from '@ionic/angular';
import {UserAccountModule} from '../user.account.module';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.page.html',
  styleUrls: ['./drafts.page.scss'],
})
export class DraftsPage implements OnInit {
  public viewMode: ViewMode = ViewMode.List;

  public drafts;
  public currentDraft = {};

  public sendTo;
  public sendToAccount;

  constructor(
      private account: UserAccountModule,
      public alertController: AlertController,
  ) {
    this.drafts = [];
  }

  async onChange(r) {
    const arr = await this.account.getSendTo(this.sendTo);
    console.log('---', r, this.sendTo, arr);
    if (1 === arr.length) {
      this.sendToAccount = arr[0];
      this.sendTo = arr[0].email;
    }
  }

  async ngOnInit() {
    this.drafts = await this.account.listDrafts();
    console.log('DraftsPage -> ngOnInit', this.drafts);
  }

  viewDraft(index) {
    this.currentDraft = this.drafts[index];
    this.viewMode = ViewMode.View;
  }

  async saveNew() {
    this.currentDraft = await this.account.saveNewDraft(this.currentDraft);
    this.drafts = this.account.drafts;
    this.viewMode = ViewMode.ModalSaved;
  }

  async save() {
    this.currentDraft = await this.account.saveDraft(this.currentDraft);
    this.drafts = this.account.drafts;
    this.viewMode = ViewMode.ModalSaved;
  }

  sendProposal() {
    this.account.sendProposal(this.sendToAccount, this.currentDraft)
        .then( () => {
          this.viewMode = 7;
        })
        .catch( (e) => {
          this.displayAuthFailureAlert(e);
        });
  }

  // ---

  async displayAuthFailureAlert(err) {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Proposal was not sent!',
      message: err.message || err,
      buttons: ['OK']
    });

    await alert.present();
  }

}

enum ViewMode {
  List = 1,
  View,
  Edit,
  New,
  ModalSaved,
  ModalSendInvite,
  ModalInvitationSent
}
