import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timedisplay'
})
export class TimedisplayPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    var hh = Math.floor(value / 3600), mm = Math.floor(value / 60) % 60, ss = Math.floor(value) % 60;
    return hh + ":" + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
  }

}
