import { Pipe, PipeTransform } from '@angular/core';

/*
 * Changes the case of the first letter of a given number of words in a string.
 */

@Pipe({
  name: 'shortDay',
})
export class DaysPipe implements PipeTransform {
  transform(input:string[], length: number): string[] {
    return input.map(day => day.slice(0, 3));
  }
}