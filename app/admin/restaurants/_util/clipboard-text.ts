export function copyCredentialToClipboard({
  id,
  password,
}: {
  id: string;
  password: string;
}) {
  navigator.clipboard.writeText(`ID: ${id}\nパスワード: ${password}`);
}
