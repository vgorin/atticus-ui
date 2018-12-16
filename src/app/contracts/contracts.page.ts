import { Component, OnInit } from '@angular/core';
import { UserAccount } from '../user.account.provider';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.page.html',
  styleUrls: ['./contracts.page.scss'],
})
export class ContractsPage implements OnInit {
  private deals: Array<Object>;

  constructor(private account: UserAccount) {}

  async ngOnInit() {
    this.deals = await this.account.getActiveDeals();
  }
}
