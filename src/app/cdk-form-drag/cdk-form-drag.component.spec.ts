import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkFormDragComponent } from './cdk-form-drag.component';

describe('CdkFormDragComponent', () => {
  let component: CdkFormDragComponent;
  let fixture: ComponentFixture<CdkFormDragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdkFormDragComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CdkFormDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
