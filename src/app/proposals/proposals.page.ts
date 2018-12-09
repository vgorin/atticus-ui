import { Component, OnInit } from '@angular/core';
import {UserAccountModule} from '../user.account.module';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.page.html',
  styleUrls: ['./proposals.page.scss'],
})
export class ProposalsPage implements OnInit {
  public viewMode: ViewMode = ViewMode.List;

  public proposals;

  constructor(private account: UserAccountModule) { }

  ngOnInit() {
    // TODO: GET http://localhost:28081/deal/received-proposals -> proposals
  }

  async viewDeal(index) {

  }
}

enum ViewMode {
  List = 1,
  View,
  Edit,
  New
}
