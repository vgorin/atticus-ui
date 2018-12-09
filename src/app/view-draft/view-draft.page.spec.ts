import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDraftPage } from './view-draft.page';

describe('ViewDraftPage', () => {
  let component: ViewDraftPage;
  let fixture: ComponentFixture<ViewDraftPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDraftPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDraftPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
