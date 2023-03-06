import { HttpClientModule } from '@angular/common/http';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ManageusersComponent } from './manageusers.component';
import { FormControl,FormsModule} from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ManageusersComponent', () => {
  let component: ManageusersComponent;
  let fixture: ComponentFixture<ManageusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageusersComponent],
      imports: [HttpClientModule, FormsModule, MatSnackBarModule],
      providers: [FormControl]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


})
