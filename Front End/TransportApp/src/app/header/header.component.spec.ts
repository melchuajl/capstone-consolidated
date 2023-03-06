import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test Case #1
  it('should have non-empty src attributes for all img tags', () => {
    const imgTags = fixture.debugElement.queryAll(By.css('img'));
    imgTags.forEach(tag => {
      const srcAttr = tag.nativeElement.getAttribute('src');
      expect(srcAttr).withContext('Expected src attribute to be non-empty, but it was empty.').toBeTruthy();
    });
  });

  // Test Case #2
  it('should have a non-empty alt attribute on the logo image', () => {
    const logoLink = fixture.debugElement.query(By.css('.navbar-brand')).nativeElement;
    const logoImage = logoLink.querySelector('img:first-child');
    expect(logoImage.getAttribute('alt')).toBeTruthy();
  });

  // Test Case #3
  it('should display Register button when not logged in', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();

    const registerButton = fixture.debugElement.query(By.css('#register')).nativeElement;
    expect(registerButton.textContent.trim()).toEqual('Register');
  });

  // Test Case #4
  it('should display Log in button when not logged in', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();

    const loginButton = fixture.debugElement.query(By.css('#login')).nativeElement;
    expect(loginButton.textContent.trim()).toEqual('Log in');
  });


  // Test Case #5
  it('should not display Register button when logged in', () => {
    // Simulate being logged in by setting the component's `isLoggedIn` property to true
    component.isLoggedIn = true;
    fixture.detectChanges(); // trigger change detection

    // Check that the Register button is not displayed
    const registerButton = fixture.debugElement.query(By.css('button[routerLink="register"]'));
    expect(registerButton).toBeNull();
  });

  // Test Case #6
  it('should not display Log in button when logged in', () => {
    // Simulate being logged in by setting the component's `isLoggedIn` property to true
    component.isLoggedIn = true;
    fixture.detectChanges(); // trigger change detection

    // Check that the Log in button is not displayed
    const loginButton = fixture.debugElement.query(By.css('button[onclick="logIn()"]'));
    expect(loginButton).toBeNull();
  });


});
