import {Component, OnInit} from '@angular/core';
import { AlertController } from '@ionic/angular';
import {UserAccount} from '../user.account.provider';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.page.html',
  styleUrls: ['./drafts.page.scss'],
})
export class DraftsPage implements OnInit {
  public viewMode: ViewMode = ViewMode.List;

  public currentDraft;

  public sendTo;
  public sendToAccount;

  constructor(
      private account: UserAccount,
      public alertController: AlertController,
  ) {
    this.currentDraft = {};
  }

  ionViewCanEnter(): Promise<any> {
    return new Promise<any>( (resolve, reject) => {
      return this.account.init().then( resolve ).catch( reject );
    });
  }

  async onChange(r) {
    const input = this.sendTo + r.key;
    if ( input.length > 0 ) {
      const arr = await this.account.getSendTo(input);
      console.log('---', r, this.sendTo, input, arr);
      this.sendToAccount = arr[0] || {};
      if ( this.sendToAccount.email ) {
        this.sendTo = arr[0].email;
      }
    }
  }

  async ngOnInit() {
    await this.account.listDrafts();
    console.log('DraftsPage -> ngOnInit', this.account.drafts);
  }

  async viewDraft(index) {
    this.currentDraft = this.account.drafts[index];
    this.viewMode = ViewMode.View;
  }

  async saveNew() {
    this.currentDraft = await this.account.saveNewDraft(this.currentDraft);
    this.viewMode = ViewMode.ModalSaved;
  }

  async save() {
    this.currentDraft = await this.account.saveDraft(this.currentDraft);
    this.viewMode = ViewMode.ModalSaved;
  }

  async sendProposal() {
    await this.onChange({key: ''});
    if ( !this.sendToAccount.email ) {
      return this.displayAuthFailureAlert('NO_SUCH_RECIPIENT');
    }
    this.account.sendProposal(this.sendToAccount, this.currentDraft)
        .then( () => {
          this.viewMode = ViewMode.ModalInvitationSent;
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
