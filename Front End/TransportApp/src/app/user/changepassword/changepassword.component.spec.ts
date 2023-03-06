import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { ChangepasswordComponent } from './changepassword.component';

describe('ChangepasswordComponent', () => {
  let component: ChangepasswordComponent;
  let fixture: ComponentFixture<ChangepasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangepasswordComponent],
      imports: [HttpClientModule, MatSnackBarModule, ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChangepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Test Case #1
  it('should have a heading named "Change password"', () => {
    const heading = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(heading.textContent.trim()).toEqual('Change password');
  });

  //Test Case #2
  it('should have a non-empty src attribute for all img tags', () => {
    const imgTags = fixture.debugElement.queryAll(By.css('img'));
    imgTags.forEach(tag => {
      const srcAttr = tag.nativeElement.getAttribute('src');
      expect(srcAttr).toBeTruthy();
    });
  });

  //Test Case #3
  it('should have a form group called changePasswordForm', () => {
    const formGroup = component.changePasswordForm;
    expect(formGroup).not.toBeNull();
  });

  //Test Case #4
  it('should have a button called "Update password" inside the form tag', () => {
    const button = fixture.debugElement.query(By.css('form button'));
    expect(button.nativeElement.textContent.trim()).toEqual('Update password');
  });

  //Test Case #5
  it('should have all input type as password if id contains "password"', () => {
    const passwordInputs = fixture.debugElement.queryAll(By.css('input'));
    passwordInputs.forEach(input => {
      if (input.nativeElement.id.includes('password')) {
        expect(input.nativeElement.type).toBe('password');
      }
    });
  });

  //Test Case #6
  it('should have buttons inside form tag', () => {
    const formElement = fixture.debugElement.query(By.css('form')).nativeElement;
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons.forEach(button => {
      expect(formElement.contains(button.nativeElement)).toBe(true);
    });
  });

});
