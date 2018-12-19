import {Component, OnInit} from '@angular/core';
import { AlertController } from '@ionic/angular';
import {UserAccount} from '../user.account.provider';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.page.html',
  styleUrls: ['./templates.page.scss'],
})


export class TemplatesPage implements OnInit {
  public viewMode: ViewMode = ViewMode.List;

  public templates;
  public currentTemplate;

  constructor(
      private account: UserAccount,
      public alertController: AlertController,
  ) {
    this.templates = [];
    this.currentTemplate = {};
  }

  async ionViewCanEnter(): Promise<any> {
    return await this.account.init();
  }

  async ngOnInit() {
    this.templates = await this.account.listTemplates();
    return await this.account.init();
  }

  async viewTemplate(index) {
    this.currentTemplate = this.templates[index];
    this.viewMode = ViewMode.View;
  }

  async saveNew() {
    this.templates = await this.account.saveNewTemplate(this.currentTemplate);
    this.templates = this.account.templates;
    this.viewMode = ViewMode.List;
  }

  async save() {
    this.templates = await this.account.saveTemplate(this.currentTemplate);
    this.templates = this.account.templates;
    this.viewMode = ViewMode.List;
  }

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
