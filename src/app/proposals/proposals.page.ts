import { Component, OnInit } from '@angular/core';
import {UserAccount} from '../user.account.provider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.page.html',
  styleUrls: ['./proposals.page.scss'],
})
export class ProposalsPage {
  public viewMode: ViewMode = ViewMode.List;

  public proposals;

  constructor(
      private account: UserAccount,
      private router: Router
  ) {
    this.proposals = [];
  }

  ionViewCanEnter(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.account.loadProposals()
          .then( () => {
            this.proposals = this.account.proposals;
            resolve(true);
          }).catch(reject);
    });
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
