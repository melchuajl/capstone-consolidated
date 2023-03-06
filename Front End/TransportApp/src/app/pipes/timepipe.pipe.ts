import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timepipe'
})
export class TimepipePipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const seconds: number = value - minutes * 60;
    return `${minutes} min ${seconds} sec`;
  }

}
