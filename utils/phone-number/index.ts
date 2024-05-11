export function isValidPhoneNumber(phoneNumber: string): boolean {
  const isValid = /^\d{10,11}$/.test(phoneNumber);
  return isValid;
}

export function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith("0")) {
    phoneNumber = phoneNumber.slice(1);
  }
  return phoneNumber;
}
