"use server";

export type BackcodeSearchResult = {
  code: string;
  name: string;
};

export async function searchBanks({ text }: { text: string }) {
  const response = await fetch(
    `https://apis.bankcode-jp.com/v3/freeword/banks?apiKey=${process.env.BANKCODE_API_KEY}&freeword=${text}&limit=10&fields=code,name`
  );
  return response.json() as Promise<{
    banks: BackcodeSearchResult[];
  }>;
}

export async function searchBranches({ bankCode }: { bankCode: string }) {
  const response = await fetch(
    `https://apis.bankcode-jp.com/v3/banks/${bankCode}/branches?apiKey=${process.env.BANKCODE_API_KEY}&fields=code,name&limit=2000`
  );
  return response.json() as Promise<{
    branches: BackcodeSearchResult[];
  }>;
}
