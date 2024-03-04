/**
 *
 * @type {string}
 */
const delimiter = " and ";

/**
 *
 * @type {string}
 */
const zero = "zero";

/**
 *
 * @type {string}
 */
const negative = "negative ";

/**
 *
 * @type {*[]}
 */
const letters = [
  ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
  ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"],
  ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
  ["", "one hundred", "two hundred", "three hundred", "four hundred", "five hundred", "six hundred", "seven hundred", "eight hundred", "nine hundred"],
  [
    "",
    " thousand",
    " million",
    " milliard",
  ],
];

/**
 * Decimal suffixes for decimal part
 * @type {string[]}
 */
const decimalSuffixes = [
  "",
  " tenth ",
  " hundredth ",
  " thousandth ",
];

/**
 * Clear number and split to 3 sections
 * @param {*} num
 */
const prepareNumber = (num) => {
  let Out = num;
  if (typeof Out === "number") {
    Out = Out.toString();
  }
  const NumberLength = Out.length % 3;
  if (NumberLength === 1) {
    Out = `00${Out}`;
  } else if (NumberLength === 2) {
    Out = `0${Out}`;
  }
  // Explode to array
  return Out.replace(/\d{3}(?=\d)/g, "$&*").split("*");
};

const threeNumbersToLetter = (num) => {
  // return zero
  if (parseInt(num, 0) === 0) {
    return "";
  }
  const parsedInt = parseInt(num, 0);
  if (parsedInt < 10) {
    return letters[0][parsedInt];
  }
  if (parsedInt <= 20) {
    return letters[1][parsedInt - 10];
  }
  if (parsedInt < 100) {
    const one = parsedInt % 10;
    const ten = (parsedInt - one) / 10;
    if (one > 0) {
      return letters[2][ten] + delimiter + letters[0][one];
    }
    return letters[2][ten];
  }
  const one = parsedInt % 10;
  const hundreds = (parsedInt - (parsedInt % 100)) / 100;
  const ten = (parsedInt - (hundreds * 100 + one)) / 10;
  const out = [letters[3][hundreds]];
  const SecondPart = ten * 10 + one;
  if (SecondPart > 0) {
    if (SecondPart < 10) {
      out.push(letters[0][SecondPart]);
    } else if (SecondPart <= 20) {
      out.push(letters[1][SecondPart - 10]);
    } else {
      out.push(letters[2][ten]);
      if (one > 0) {
        out.push(letters[0][one]);
      }
    }
  }
  return out.join(delimiter);
};

/**
 * Convert Decimal part
 * @param decimalPart
 * @returns {string}
 * @constructor
 */
const convertDecimalPart = (decimalPart) => {
  // Clear right zero
  decimalPart = decimalPart.replace(/0*$/, "");

  if (decimalPart === "") {
    return "";
  }

  if (decimalPart.length > 11) {
    decimalPart = decimalPart.substr(0, 11);
  }
  return " point " + numberToEnglish(decimalPart) + " " + decimalSuffixes[decimalPart.length];
};

/**
 * Main function
 * @param input
 * @returns {string}
 * @constructor
 */
const numberToEnglish = (input) => {
  // Clear Non digits
  input = input.toString().replace(/[^0-9.-]/g, "");
  let isNegative = false;
  const floatParse = parseFloat(input);
  // return zero if this isn't a valid number
  if (isNaN(floatParse)) {
    return zero;
  }
  // check for zero
  if (floatParse === 0) {
    return zero;
  }
  // set negative flag:true if the number is less than 0
  if (floatParse < 0) {
    isNegative = true;
    input = input.replace(/-/g, "");
  }

  // Declare Parts
  let decimalPart = "";
  let integerPart = input;
  let pointIndex = input.indexOf(".");
  // Check for float numbers form string and split Int/Dec
  if (pointIndex > -1) {
    integerPart = input.substring(0, pointIndex);
    decimalPart = input.substring(pointIndex + 1, input.length);
  }

  if (integerPart.length > 66) {
    return "خارج از محدوده";
  }

  // Split to sections
  const slicedNumber = prepareNumber(integerPart);
  // Fetch Sections and convert
  const Output = [];
  const SplitLength = slicedNumber.length;
  for (let i = 0; i < SplitLength; i += 1) {
    const SectionTitle = letters[4][SplitLength - (i + 1)];
    const converted = threeNumbersToLetter(slicedNumber[i]);
    if (converted !== "") {
      Output.push(converted + SectionTitle);
    }
  }

  // Convert Decimal part
  if (decimalPart.length > 0) {
    decimalPart = convertDecimalPart(decimalPart);
  }

  return (isNegative ? negative : "") + Output.join(delimiter) + decimalPart;
};

String.prototype.toPersianLetter = function () {
  return numberToEnglish(this);
};

Number.prototype.toPersianLetter = function () {
  return numberToEnglish(parseFloat(this).toString());
};

export default numberToEnglish;
