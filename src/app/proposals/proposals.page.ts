import { Component, OnInit } from '@angular/core';
import {UserAccount} from '../user.account.provider';
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
      private account: UserAccount,
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
    console.log('setDealToView', deal);
    this.router.navigateByUrl('/deal/' + [this.account.account_id, deal.contracter_id].join('/') );
  }
}

enum ViewMode {
  List = 1,
  View,
  Edit,
  New
}
