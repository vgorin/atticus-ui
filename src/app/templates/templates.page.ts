import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.page.html',
  styleUrls: ['./templates.page.scss'],
})


export class TemplatesPage implements OnInit {

  public templates;
  public currentTemplate = {};

  constructor(private account: UserAccountModule) {}

  async ngOnInit() {
    this.templates = await this.account.listTemplates();
    console.log('DraftsPage -> ngOnInit', this.templates);
  }

  async viewTemplate(index) {
    this.currentTemplate = this.templates[index];
  }

  async saveNew() {
    this.templates = await this.account.saveNewTemplate(this.currentTemplate);
    // this.viewMode = 1;
  }

  async save() {
    this.templates = await this.account.saveTemplate(this.currentTemplate);
    // this.viewMode = 1;
  }

}
