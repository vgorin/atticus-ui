import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.page.html',
  styleUrls: ['./contracts.page.scss'],
})
export class ContractsPage implements OnInit {
  private contracts: Array<Object>;

  constructor(private account: UserAccountModule) {}

  async ngOnInit() {
    this.contracts = await this.account.getContracts();
  }
}
