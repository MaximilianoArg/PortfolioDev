import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs',
  standalone: true
})
export class AbsPipe implements PipeTransform {

  transform(value: number): number {
    if (isNaN(value)) {
      return 0;
    }
    return Math.abs(value);
  }

}