import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAccount } from '../user.account.provider';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(
      private router: Router,
      private account: UserAccount
  ) { }

  async ionViewCanEnter(): Promise<any> {
    return await this.account.init();
  }

  async ngOnInit() {
    await this.account.init();
    const auth = this.account.auth || { email : null };
    if ( auth.email ) {
      return this.router.navigateByUrl('/contracts');
    }
  }

}
