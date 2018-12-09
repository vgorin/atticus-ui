import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-draft',
  templateUrl: './view-draft.page.html',
  styleUrls: ['./view-draft.page.scss'],
})
export class ViewDraftPage implements OnInit {

  public draft_name = "Baseball Bet";
  public draft_text = `The intent captured within this memorandum (‘Amendement”) is to amend the existing signed agreement between parties signed on`;

  constructor() { }

  ngOnInit() {
  }

}
