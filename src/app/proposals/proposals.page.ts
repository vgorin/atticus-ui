import { Component, OnInit } from '@angular/core';
import {UserAccountModule} from '../user.account.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.page.html',
  styleUrls: ['./proposals.page.scss'],
})
export class ProposalsPage implements OnInit {
  public viewMode: ViewMode = ViewMode.List;

  public proposals;

  constructor(
      private account: UserAccountModule,
      private router: Router
  ) {
    this.proposals = [];
  }

  async ngOnInit() {
    await this.account.loadProposals();
    this.proposals = this.account.proposals;
    console.log("viewMode", this.viewMode);
  }

  async openDeal(index) {
    const deal = this.proposals[index];
    await this.account.setDealToView(deal);
    this.router.navigateByUrl('/deal');
  }
}

enum ViewMode {
  List = 1,
  View,
  Edit,
  New
}
