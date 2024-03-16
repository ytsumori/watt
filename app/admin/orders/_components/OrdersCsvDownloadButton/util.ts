import Encoding from "encoding-japanese";
import Papa from "papaparse";

export const isValidHolderName = (holderName: string): boolean => {
  const splittedName = holderName.split("");
  const regex = new RegExp(/[ｦ-ﾟ]/);
  const isValid = splittedName.every((name) =>
    name.match(regex) && name !== " "
  );
  return isValid;
};

export const convertToBlob = (records: (string | number)[][]): Blob => {
  const config = { delimiter: ",", header: true, newline: "\r\n" };
  const delimiterString = Papa.unparse(records, config);
  const strArray = Encoding.stringToCode(delimiterString);
  const convertedArray = Encoding.convert(strArray, "UTF8", "UNICODE");
  const UintArray = new Uint8Array(convertedArray);
  return new Blob([UintArray], { type: "text/csv" });
};
