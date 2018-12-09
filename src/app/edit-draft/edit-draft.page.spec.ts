import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDraftPage } from './edit-draft.page';

describe('EditDraftPage', () => {
  let component: EditDraftPage;
  let fixture: ComponentFixture<EditDraftPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDraftPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDraftPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
