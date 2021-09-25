import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'appformatDate'
})
export class FormatDatePipe implements PipeTransform {

  /**
   * Format the date from a timestamp to a human readable date 
   * 
   * @param lastReported number
   * @param args []
   * @returns fateFormatted
   */
  transform(lastReported: number, ...args: unknown[]): unknown {

    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date(lastReported * 1000);
    const aMoment = moment(date);

    return aMoment.format('dddd, MMMM Do YYYY')

    return null;
  }

}
