import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { RecoverpasswordComponent } from './recoverpassword.component';

describe('RecoverpasswordComponent', () => {
  let component: RecoverpasswordComponent;
  let fixture: ComponentFixture<RecoverpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoverpasswordComponent ],
      imports: [HttpClientModule, MatSnackBarModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Test Case #1
  it('should have an image with a non-empty source URL', () => {
    const imgEl = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(imgEl.getAttribute('src')).toBeTruthy();
  });

   //Test Case #2
  it('should have a heading called "Recover password"', () => {
    const h2El = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(h2El.textContent).toContain('Recover password');
  });

   //Test Case #3
   it('should have a button with text "Send"', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.textContent.trim()).toEqual('Send');
  });  

   //Test Case #4
  it('should have an anchor tag with a routerLink attribute set to "../login"', () => {
    const anchorEl = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(anchorEl.getAttribute('routerLink')).toBe('../login');
  });

   //Test Case #5
  it('should contain the text "Forgot your password"', () => {
    const pEl = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(pEl.textContent).toContain('Forgot your password');
  });

});
