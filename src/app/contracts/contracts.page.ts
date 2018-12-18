import { Component, OnInit } from '@angular/core';
import { UserAccount } from '../user.account.provider';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.page.html',
  styleUrls: ['./contracts.page.scss'],
})
export class ContractsPage implements OnInit {
  private viewMode = ViewMode.List;

  private activeDeals;
  private currentDeal;

  constructor(private account: UserAccount) {
    this.activeDeals = [];
    this.currentDeal = {};
  }

  async ionViewCanEnter(): Promise<any> {
    return await this.account.init();
  }

  async ngOnInit() {
    this.activeDeals = await this.account.getActiveDeals();
  }

  async viewActiveDeal(index) {
    this.currentDeal = this.activeDeals[index];
    this.viewMode = ViewMode.View;
  }
}

enum ViewMode {
  List = 1,
  View,
}
