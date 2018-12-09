import { Component, OnInit } from '@angular/core';
import { UserAccountModule } from '../user.account.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
      private router: Router,
      private user_account: UserAccountModule
  ) { }

  ngOnInit() {
    this.user_account.logOut().then( () => {
      return this.router.navigateByUrl('/');
    });
  }

}
