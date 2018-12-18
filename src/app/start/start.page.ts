import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAccount } from '../user.account.provider';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage {

  constructor(
      private router: Router,
      private account: UserAccount
  ) { }

  ionViewCanEnter(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.account.init()
          .then( (templates) => {
            const auth = this.account.auth || { email : null };
            if ( auth.email ) {
              this.router.navigateByUrl('/contracts');
            }
            resolve(true);
          }).catch(reject);
    });
  }

}
