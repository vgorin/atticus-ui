import { Component, OnInit } from '@angular/core';
import { UserAccount } from '../user.account.provider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
      private router: Router,
      private account: UserAccount
  ) { }

  async ionViewCanEnter(): Promise<any> {
    return await this.account.init();
  }

  ngOnInit() {
    this.account.logOut().then( () => {
      return this.router.navigateByUrl('/');
    });
  }

}
