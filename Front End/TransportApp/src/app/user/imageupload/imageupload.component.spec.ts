import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { ImageuploadComponent } from './imageupload.component';

describe('ImageuploadComponent', () => {
  let component: ImageuploadComponent;
  let fixture: ComponentFixture<ImageuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageuploadComponent],
      imports: [HttpClientModule, MatSnackBarModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ImageuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test Case #1
  it('should have file input for selecting file to upload', () => {
    const fileInputElement = fixture.debugElement.query(By.css('input[type="file"]'));
    expect(fileInputElement).toBeTruthy();
  });

  // Test Case #2
  it('should display the message when message is present', () => {
    component.message = 'File uploaded successfully';
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.upload'));
    expect(span.nativeElement.textContent.trim()).toEqual(component.message);
  });

  // Test Case #3
  it('should display progress when progress is between 0 and 100', () => {
    component.progress = 50;
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.upload'));
    expect(span.nativeElement.textContent.trim()).toEqual(`Fetching image ${component.progress}%`);
  });

  // Test Case #4
  it('should display message when message is not null', () => {
    component.message = 'Image has been fetched';
    fixture.detectChanges();
    const messageElement = fixture.debugElement.query(By.css('.upload')).nativeElement;
    expect(messageElement.textContent).toContain('Image has been fetched');
  });

  // Test Case #5
  it('should bind the uploadFile method to the input element\'s change event', () => {
    const inputElement = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement;
    const changeSpy = spyOn(component, 'uploadFile');
    inputElement.dispatchEvent(new Event('change'));
    expect(changeSpy).toHaveBeenCalled();
  });

});
