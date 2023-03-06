import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { ImageuploadComponent } from '../imageupload/imageupload.component';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent, ImageuploadComponent],
      imports: [HttpClientModule, MatSnackBarModule, ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test Case #1
  it('should have a formGroup property set to "registerForm"', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm).toBeTruthy();
  });

  // Test Case #2
  it('should have an input element with id "email" and type "email"', () => {
    const inputEl = fixture.debugElement.query(By.css('#email')).nativeElement;
    expect(inputEl.type).toBe('email');
  });

  // Test Case #3
  it('should have an input element with id "password" and type "password"', () => {
    const inputEl = fixture.debugElement.query(By.css('#password')).nativeElement;
    expect(inputEl.type).toBe('password');
  });

  // Test Case #4
  it('should have an input element with id "dateOfBirth" and type "date"', () => {
    const inputEl = fixture.debugElement.query(By.css('#dateOfBirth')).nativeElement;
    expect(inputEl.type).toBe('date');
  });

  // Test Case #5
  it('should have a button with the text "Upload image"', () => {
    const buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonEl.textContent).toContain('Upload image');
  });
  
  // Test Case #6
  it('should have all input elements inside a form tag', () => {
    const formEl = fixture.debugElement.query(By.css('form')).nativeElement;
    const inputEls = fixture.debugElement.query
  });

});
