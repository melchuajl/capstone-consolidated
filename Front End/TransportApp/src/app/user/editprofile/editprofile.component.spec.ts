import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImageuploadComponent } from '../imageupload/imageupload.component';
import { By } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';

import { EditprofileComponent } from './editprofile.component';

describe('EditprofileComponent', () => {
  let component: EditprofileComponent;
  let fixture: ComponentFixture<EditprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditprofileComponent, ImageuploadComponent],
      imports: [HttpClientModule, MatSnackBarModule, ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test Case #1
  it('should have a non-empty src attribute for all img tags', () => {
    const imgElements = fixture.debugElement.queryAll(By.css('img'));

    for (const imgElement of imgElements) {
      const srcAttr = imgElement.nativeElement.getAttribute('src');
      expect(srcAttr).withContext(`Expected non-empty src attribute for img element: ${imgElement.nativeElement.outerHTML}`);
    }
  });

  // Test Case #2
  it('should have a FormGroup called updateForm', () => {
    expect(component.updateForm instanceof FormGroup).toBeTruthy();
    expect(component.updateForm).toEqual(component['updateForm']);
  });

  // Test Case #3
  it('should have a button named Upload image', () => {
    const button = fixture.debugElement.query(By.css('#uploadimage'));
    expect(button.nativeElement.textContent.trim()).toEqual('Upload image');
  });

  // Test Case #4
  it('should have input field with formControlName "dateOfBirth" of type date', () => {
    const inputElement = fixture.debugElement.query(By.css('[formControlName="dateOfBirth"]')).nativeElement;
    expect(inputElement.type).toBe('date');
  });

  // Test Case #5
  it('should have a button with id "savechanges" called Save changes', () => {
    const button = fixture.debugElement.query(By.css('#savechanges'));
    expect(button.nativeElement.textContent.trim()).toEqual('Save changes');
  });

  // Test Case #6
  it('should have buttons inside form tag', () => {
    const formElement = fixture.debugElement.query(By.css('form')).nativeElement;
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons.forEach(button => {
      expect(formElement.contains(button.nativeElement)).toBe(true);
    });
  });


});
