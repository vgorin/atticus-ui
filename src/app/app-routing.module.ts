import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'start', loadChildren: './start/start.module#StartPageModule' },
  { path: 'contracts', loadChildren: './contracts/contracts.module#ContractsPageModule' },
  { path: 'new-contract', loadChildren: './new-contract/new-contract.module#NewContractPageModule' },
  { path: 'drafts', loadChildren: './drafts/drafts.module#DraftsPageModule' },
  { path: 'new-draft', loadChildren: './new-draft/new-draft.module#NewDraftPageModule' },
  { path: 'view-draft', loadChildren: './view-draft/view-draft.module#ViewDraftPageModule' },
  { path: 'edit-draft', loadChildren: './edit-draft/edit-draft.module#EditDraftPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
