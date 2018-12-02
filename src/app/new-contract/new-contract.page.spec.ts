import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContractPage } from './new-contract.page';

describe('NewContractPage', () => {
  let component: NewContractPage;
  let fixture: ComponentFixture<NewContractPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewContractPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewContractPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
