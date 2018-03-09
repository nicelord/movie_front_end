import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'limitText'
})
export class LimitTextPipe implements PipeTransform {

  transform(value: string, args: string) {

    var limit = (args) ? parseInt(args) : 50;

    if (value) {
      return value.substr(0, limit) + '...';
    }
  }

}
