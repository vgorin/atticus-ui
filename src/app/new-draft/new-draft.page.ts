import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-draft',
  templateUrl: './new-draft.page.html',
  styleUrls: ['./new-draft.page.scss'],
})
export class NewDraftPage implements OnInit {

  public draft_name = "";
  public draft_text = ``;

  constructor() { }

  ngOnInit() {
  }

}
