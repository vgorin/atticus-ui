import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.page.html',
  styleUrls: ['./templates.page.scss'],
})


export class TemplatesPage implements OnInit {
  public viewMode: ViewMode = ViewMode.List;

  public templates;
  public currentTemplate = {};

  constructor(private account: UserAccountModule) {
    this.templates = [];
  }

  async ngOnInit() {
    this.templates = await this.account.listTemplates();
    console.log('DraftsPage -> ngOnInit', this.templates);
  }

  viewTemplate(index) {
    this.currentTemplate = this.templates[index];
    this.viewMode = ViewMode.View;
  }

  async saveNew() {
    this.templates = await this.account.saveNewTemplate(this.currentTemplate);
    this.viewMode = 1;
  }

  async save() {
    this.templates = await this.account.saveTemplate(this.currentTemplate);
    this.viewMode = 1;
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
