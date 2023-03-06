import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverpasswordSentComponent } from './recoverpassword-sent.component';

describe('RecoverpasswordSentComponent', () => {
  let component: RecoverpasswordSentComponent;
  let fixture: ComponentFixture<RecoverpasswordSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoverpasswordSentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverpasswordSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
