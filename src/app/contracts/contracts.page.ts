import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.page.html',
  styleUrls: ['./contracts.page.scss'],
})
export class ContractsPage implements OnInit {
  private deals: Array<Object>;

  constructor(private account: UserAccountModule) {}

  async ngOnInit() {
    this.deals = await this.account.getActiveDeals();
  }
}
