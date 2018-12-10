import { Component, OnInit } from '@angular/core';
import {UserAccountModule} from '../user.account.module';

@Component({
  selector: 'app-deal',
  templateUrl: './deal.page.html',
  styleUrls: ['./deal.page.scss'],
})
export class DealPage implements OnInit {
  public deal;

  constructor(private account: UserAccountModule) { }

  async ngOnInit() {
    await this.account.getDealToView();
    this.deal = this.account.dealToView;
    console.log("deal to view", this.deal);
  }

}
