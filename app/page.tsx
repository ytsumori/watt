import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image src="/watt-logo.png" alt="Watt" width={60} height={30} />
      <span>はサービスを終了いたしました。ご利用ありがとうございました。</span>
    </div>
  );
}
