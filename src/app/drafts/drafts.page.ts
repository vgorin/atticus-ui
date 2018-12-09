import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';

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
    const list = await this.account.listDrafts();
    console.log('DraftsPage -> ngOnInit', list);
    this.drafts = list;
  }

}

enum ViewMode {
  List = 1,
  View,
  Edit,
  New
}
