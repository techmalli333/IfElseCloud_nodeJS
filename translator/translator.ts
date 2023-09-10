// Define a mapping of numeric sequences to English characters
const numericToEnglishMap: Record<string, string> = {
  "2": "a",
  "22": "b",
  "222": "c",
  "3": "d",
  "33": "e",
  "333": "f",
  "4": "g",
  "44": "h",
  "444": "i",
  "5": "j",
  "55": "k",
  "555": "l",
  "6": "m",
  "66": "n",
  "666": "o",
  "7": "p",
  "77": "q",
  "777": "r",
  "7777": "s",
  "8": "t",
  "88": "u",
  "888": "v",
  "9": "w",
  "99": "x",
  "999": "y",
  "9999": "z",
  "0": " "
};

// function to convert text to numeric using the reverse mapping
export function textToNumeric(input: string): string {
  const reverseMap: Record<string, string> = {};
  for (const key in numericToEnglishMap) {
    if (numericToEnglishMap.hasOwnProperty(key)) {
      const value = numericToEnglishMap[key];
      reverseMap[value] = key;
    }
  }

  const words = input.split(" ");
  const numericWords = words.map((word) => {
    const characters = word.split("");
    const charToNum = characters.map((char) => reverseMap[char]);
    let final_charToNum = "";
    charToNum.forEach((char) => {
      const current_num = char[0];
      const previous_num = final_charToNum[final_charToNum.length - 1];
      // if current number is equal to previous number add .
      if (current_num === previous_num) {
        final_charToNum += "." + char;
      } else final_charToNum += char;
    });
    return final_charToNum;
  });

  return numericWords.join(" ");
}

// function to convert numeric to text
export function numericToText(input: string): string {
  const words = input.split(" ");
  const textWords = words.map((word) => {
    const regex = /(\d)\1*/g; // Regular expression to match consecutive identical digits
    /* 
        (\d)\1* pattern.
        \d matches a single digit.
        (\d) captures the matched digit in a capturing group.
        \1* matches zero or more occurrences of the captured digit (i.e., consecutive identical digits).
    */
    const resultArray: string[] | null = word.match(regex);

    return resultArray?.map((char) => numericToEnglishMap[char]).join("");
  });

  return textWords.join(" ");
}

// Example usage
// const input1: string = "houston do you copy";
// const output1: string = textToNumeric(input1);
// console.log("Output1 Translation:", output1);

// const input2: string =
//   "44434446668 444 26 33555666.66 66.6668 44666887777866666";
