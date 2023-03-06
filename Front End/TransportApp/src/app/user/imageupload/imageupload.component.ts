import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-imageupload',
  templateUrl: './imageupload.component.html',
  styleUrls: ['./imageupload.component.css']
})
export class ImageuploadComponent {

  progress: number = 0;
  message: string = '';
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(`${environment.imageupload}`, formData, { reportProgress: true, observe: 'events' })
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round(100 * event.loaded / event.total);
          else if (event.type === HttpEventType.Response) {
            this.message = 'Image has been fetched';
            this.onUploadFinished.emit(event.body);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open("Something went wrong, please try again", "OK", {
            verticalPosition: 'top'
          });
        }
      });
  }

}
