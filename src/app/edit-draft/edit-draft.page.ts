import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-draft',
  templateUrl: './edit-draft.page.html',
  styleUrls: ['./edit-draft.page.scss'],
})
export class EditDraftPage implements OnInit {

  public draft_name = "Baseball Bet";
  public draft_text = `The intent captured within this memorandum (‘Amendement”) is to amend the existing signed agreement between parties signed on`;

  constructor() { }

  ngOnInit() {
  }

}
