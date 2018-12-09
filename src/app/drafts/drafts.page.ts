import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.page.html',
  styleUrls: ['./drafts.page.scss'],
})
export class DraftsPage implements OnInit {

  public drafts = [
    "Baseball Bet",
    "Consultant Agreement",
    "Software Dev Agreement",
    "3-Party bet",
    "Rental Agreement"
  ];

  constructor(private account: UserAccountModule) {}

  async ngOnInit() {
    const list = await this.account.listDrafts();
    console.log('DraftsPage -> ngOnInit', list);
  }

}
