import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientModule, MatSnackBarModule, ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Test Case #1
  it('should have a form group called loginForm', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const loginForm = fixture.componentInstance.loginForm;
    expect(loginForm).toBeDefined();
  });

   //Test Case #2
  it('should have a non-empty src attribute on the image', () => {
    const img = document.querySelector('img');
    expect(img?.src).toBeTruthy();
  });

   //Test Case #3
  it('should have input type set to email', () => {
    const inputEl = fixture.debugElement.query(By.css('#email')).nativeElement;
    expect(inputEl.getAttribute('type')).toBe('email');
  });

   //Test Case #4
  it('should have input type set to password', () => {
    const inputEl = fixture.debugElement.query(By.css('#password')).nativeElement;
    expect(inputEl.getAttribute('type')).toBe('password');
  });

   //Test Case #5
  it('should have routerLink set to ../forgot-password', () => {
    const linkEl = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(linkEl.getAttribute('routerLink')).toBe('../forgot-password');
  });

   //Test Case #6
  it('should have routerLink set to ../register', () => {
    const linkEl = fixture.debugElement.queryAll(By.css('a'))[1].nativeElement;
    expect(linkEl.getAttribute('routerLink')).toBe('../register');
  });

   //Test Case #7
  it('should have all input fields inside the form tag', () => {
    const formEl = fixture.debugElement.query(By.css('form')).nativeElement;
    const inputEls = fixture.debugElement.queryAll(By.css('input')).map((el) => el.nativeElement);
    inputEls.forEach((inputEl) => {
      expect(formEl.contains(inputEl)).toBe(true);
    });
  });

  //Test Case #8
  it('should have a button called "Login"', () => {
    const buttonEl = fixture.debugElement.nativeElement.querySelector('button');
    expect(buttonEl).not.toBeNull();
    expect(buttonEl.textContent).toBe('Login');
  });

});
