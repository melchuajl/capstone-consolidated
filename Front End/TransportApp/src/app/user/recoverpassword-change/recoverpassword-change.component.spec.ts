import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { RecoverpasswordChangeComponent } from './recoverpassword-change.component';

describe('RecoverpasswordChangeComponent', () => {
  let component: RecoverpasswordChangeComponent;
  let fixture: ComponentFixture<RecoverpasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoverpasswordChangeComponent ],
      imports: [HttpClientModule, MatSnackBarModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverpasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test Case #1
  it('should have a "Reset your password" heading', () => {
    const heading = fixture.debugElement.query(By.css('h2'));
    expect(heading.nativeElement.innerText).toContain('Reset your password');
  });
  
  // Test Case #2
  it('should have an input with id "password" should have input type "password"', () => {
    const input = fixture.debugElement.query(By.css('input#password'));
    expect(input.nativeElement.type).toEqual('password');
  });
   

});
