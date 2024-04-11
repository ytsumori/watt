"use server";

export type BankcodeSearchResult = {
  code: string;
  name: string;
};

type BankcodeErrorMessage = {
  message: string;
};

export async function searchBanks({ text }: { text: string }) {
  const response = await fetch(
    `https://apis.bankcode-jp.com/v3/freeword/banks?apiKey=${process.env.BANKCODE_API_KEY}&freeword=${text}&limit=10&fields=code,name`
  );
  return response.json() as Promise<Partial<{ banks: BankcodeSearchResult[] } & BankcodeErrorMessage>>;
}

export async function getBank({ bankCode }: { bankCode: string }) {
  const response = await fetch(
    `https://apis.bankcode-jp.com/v3/banks/${bankCode}?apiKey=${process.env.BANKCODE_API_KEY}&fields=code,name`
  );
  return response.json() as Promise<Partial<BankcodeSearchResult & BankcodeErrorMessage>>;
}

export async function searchBranches({ bankCode }: { bankCode: string }) {
  const response = await fetch(
    `https://apis.bankcode-jp.com/v3/banks/${bankCode}/branches?apiKey=${process.env.BANKCODE_API_KEY}&fields=code,name&limit=2000`
  );
  return response.json() as Promise<Partial<{ branches: BankcodeSearchResult[] } & BankcodeErrorMessage>>;
}

export async function getBranch({ bankCode, branchCode }: { bankCode: string; branchCode: string }) {
  const response = await fetch(
    `https://apis.bankcode-jp.com/v3/banks/${bankCode}/branches/${branchCode}?apiKey=${process.env.BANKCODE_API_KEY}&fields=code,name`
  );
  return response.json() as Promise<Partial<{ branch: BankcodeSearchResult } & BankcodeErrorMessage>>;
}
