import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'start', loadChildren: './start/start.module#StartPageModule' },
  { path: 'contracts', loadChildren: './contracts/contracts.module#ContractsPageModule' },
  { path: 'drafts', loadChildren: './drafts/drafts.module#DraftsPageModule' },
  { path: 'proposals', loadChildren: './proposals/proposals.module#ProposalsPageModule' },
  { path: 'logout', loadChildren: './logout/logout.module#LogoutPageModule' },
  { path: 'templates', loadChildren: './templates/templates.module#TemplatesPageModule' },
  { path: 'deal/:account_id', loadChildren: './deal/deal.module#DealPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
