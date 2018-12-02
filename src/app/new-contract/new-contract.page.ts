import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.page.html',
  styleUrls: ['./new-contract.page.scss'],
})
export class NewContractPage implements OnInit {
  private user: string;
  private memo: string;
  private body: string;
  private to: number;

  constructor(private storage: Storage) { }

  async proposeContract() {
    console.log(this.user, this.memo, this.body, this.to);
  }

  async ngOnInit() {
    const str = await this.storage.get('user');
    this.user = JSON.parse(str);
    console.log('NewContractPage-user', this.user);
  }

}
