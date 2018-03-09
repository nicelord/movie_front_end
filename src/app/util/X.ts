import {Injectable} from "@angular/core";
/**
 * Created by asus on 09/11/2017.
 */
@Injectable()
export class X {

  public static x0 (encodedStr): any{
    var codeArr = encodedStr.split(""),
      decodedArr = [], char;

    function isLetter(char) {
      return /[a-z]/i.test(char);
    }

    function cipher(letter) {
      var charCode = letter.charCodeAt(0), // ASCII
        exceedsM = (charCode < 97) ? charCode > 77 : charCode > 109;

      return (exceedsM) ? charCode - 13 : charCode + 13;
    } // Transforms the letter into a new ASCII code

    for (var i = 0; i < codeArr.length; i++) {
      char = codeArr[i]; // Cache the current character

      if (isLetter(char)) {
        char = String.fromCharCode(cipher(char));
      } // Re-Assigns the letter for the ciphered new one

      decodedArr.push(char);
    } // Finished iterating and pushing

    return decodedArr.join("");
  }

}
