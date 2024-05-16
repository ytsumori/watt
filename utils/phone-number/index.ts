export function isValidPhoneNumber(phoneNumber: string): boolean {
  const isValid = phoneNumber.match(/^\d{9,10}$/) !== null;
  return isValid;
}

export function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith("0")) {
    phoneNumber = phoneNumber.slice(1);
  }
  return phoneNumber;
}
