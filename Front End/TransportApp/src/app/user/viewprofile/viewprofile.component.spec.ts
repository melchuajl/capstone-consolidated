import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

import { ViewprofileComponent } from './viewprofile.component';

describe('ViewprofileComponent', () => {
  let component: ViewprofileComponent;
  let fixture: ComponentFixture<ViewprofileComponent>;

  const fakeActivatedRoute = {
    snapshot: {data: {}}
  } as ActivatedRoute

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewprofileComponent ],
      imports: [HttpClientModule],
      providers:[{provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Test Case #1
  it('should not have empty src attribute for profile image', () => {
    const currentUser = {
      profilePicture: 'path/to/profile-image.jpg',
    };
    fixture.componentInstance.currentUser = currentUser;
    fixture.detectChanges();
    
    const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(imgElement.src).toContain(currentUser.profilePicture);
  });
  
  //Test Case #2
  it('should have an alt attribute for profile image', () => {
    const currentUser = {
      profilePicture: 'path/to/profile-image.jpg',
    };
    fixture.componentInstance.currentUser = currentUser;
    fixture.detectChanges();
    
    const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(imgElement.hasAttribute('alt')).toBeTruthy();
  });

  //Test Case #3
  it('should have a button to edit profile with id="edit" and routerLink="edit"', () => {
    const buttonElement = fixture.debugElement.query(By.css('#edit')).nativeElement;
    expect(buttonElement.getAttribute('routerLink')).toBe('edit');
  });  
  
  //Test Case #4
  it('should show the admin button only for admin users', () => {
    component.currentUser = { isAdmin: true };
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('#admin'));
    expect(buttonElement).toBeTruthy();
  
    component.currentUser = { isAdmin: false };
    fixture.detectChanges();
    const buttonElement2 = fixture.debugElement.query(By.css('#admin'));
    expect(buttonElement2).toBeFalsy();
  });
  
  //Test Case #5
  it('should have a button with id="changepassword"', () => {
    const buttonElement = fixture.debugElement.query(By.css('#changepassword'));
    expect(buttonElement).toBeTruthy();
  });  

});
