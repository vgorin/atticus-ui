import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAccount } from '../signup/user.account';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.page.html',
  styleUrls: ['./contracts.page.scss'],
})
export class ContractsPage implements OnInit {
  private contracts: Array<Object>;
  private account: UserAccount;

  constructor(
      private http: HttpClient,
      private storage: Storage
  ) {
    this.account = new UserAccount(this.http);
  }

  addContract() {

  }

  async ngOnInit() {
    const str = await this.storage.get('user');
    const user = JSON.parse(str);
    console.log('ContractsPage-user', user);
    this.contracts = await this.account.getContracts(user);
    console.log('ContractsPage-contracts', this.contracts);
  }
}
