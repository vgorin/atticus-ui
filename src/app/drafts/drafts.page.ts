import {Component, OnInit} from '@angular/core';
import {UserAccountModule} from '../user.account.module';
import {ViewMode} from "../view_mode";

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

  constructor(private account: UserAccountModule) {
    this.drafts = [];
  }

  async ngOnInit() {
    this.drafts = await this.account.listDrafts();
    console.log('DraftsPage -> ngOnInit', this.drafts);
  }

  async viewDraft(index) {
    console.log("viewDraft", index);
    this.currentDraft = this.drafts[index];
    this.viewMode = ViewMode.View;
  }

  async saveNew() {
    this.drafts = await this.account.saveNewDraft(this.currentDraft);
    this.viewMode = ViewMode.Success;
  }

  async save() {
    this.drafts = await this.account.saveDraft(this.currentDraft);
    this.viewMode = ViewMode.Success;
  }

  async sendProposal() {
    // TODO: POST /deal?contract_id={{currentDraft.contract_id}}&to_account_id={{sendTo}}&deal_title={{currentDraft.memo}}
  }

}
