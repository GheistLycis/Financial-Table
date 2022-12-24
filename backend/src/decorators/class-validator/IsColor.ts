import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isColor', async: false })
export class IsColor implements ValidatorConstraintInterface {
  validate(color: string) {
    // HEX
    if(
      color[0] == '#' &&
      color.length >= 4 && 
      color.length <= 7 &&
      color.substring(1).replace(/[\d\w]/g, '').length == 0
    ) return true

    // RGB / RGBA 
    if(
      color.substring(0, 3) == 'rgb' && 
      color.length >= 10 && 
      color.length <= 18 &&
      color.substring(3).replace(/[\d\s,()%]/g, '').length == 0
    ) return true

    if(
      color.substring(0, 4) == 'rgba' && 
      color.length >= 13 && 
      color.length <= 25 &&
      color.substring(4).replace(/[\d\s,.()%]/g, '').length == 0
    ) return true

    // HSL / HSLA
    if(
      color.substring(0, 3) == 'hsl' && 
      color.length >= 14 && 
      color.length <= 20 &&
      color.substring(3).replace(/[\d\s,()%]/g, '').length == 0
    ) return true

    if(
      color.substring(0, 4) == 'hsla' && 
      color.length >= 4 && 
      color.length <= 7 &&
      color.substring(4).replace(/[\d\s,.()%]/g, '').length == 0
    ) return true

    // KEYWORD
    const keywords = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'grey', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgrey', 'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen']

    if(keywords.includes(color)) return true

    return false
  }

  defaultMessage() {
    return 'not a valid color.'
  }
}