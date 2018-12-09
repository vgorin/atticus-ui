import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';
import { ViewMode } from "../view_mode";

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.page.html',
  styleUrls: ['./drafts.page.scss'],
})
export class DraftsPage implements OnInit {
  public viewMode: ViewMode = ViewMode.List;

  public drafts;
  public currentDraft = {};

  constructor(private account: UserAccountModule) {}

  async ngOnInit() {
    this.drafts = await this.account.listDrafts();
    console.log('DraftsPage -> ngOnInit', this.drafts);
  }

  async viewDraft(index) {
    console.log("viewing draft ", index, this.drafts[index]);
    this.currentDraft = this.drafts[index];
  }

  async saveNew() {
    this.drafts = await this.account.saveNewDraft(this.currentDraft);
    this.viewMode = 1;
  }

  async save() {
    this.drafts = await this.account.saveDraft(this.currentDraft);
    this.viewMode = 1;
  }

}
