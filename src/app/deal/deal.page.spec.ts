import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealPage } from './deal.page';

describe('DealPage', () => {
  let component: DealPage;
  let fixture: ComponentFixture<DealPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
