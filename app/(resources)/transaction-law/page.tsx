"use client";

import { Box, Heading, Text } from "@chakra-ui/react";

export default function TransactionLaw() {
  return (
    <Box w="100%" p={2}>
      <Heading size="lg">特定商取引法に基づく表記</Heading>
      <Heading size="md" mt={4} mb={2}>
        販売業者
      </Heading>
      <Text>株式会社キーザンキーザン</Text>
      <Heading size="md" mt={4} mb={2}>
        店名
      </Heading>
      <Text>Watt</Text>
      <Heading size="md" mt={4} mb={2}>
        運営責任者
      </Heading>
      <Text>井上 大輔</Text>
      <Heading size="md" mt={4} mb={2}>
        所在地
      </Heading>
      <Text>
        〒550-0012
        <br />
        大阪府大阪市西区立売堀1丁目4-12 立売堀スクエアビル7F
      </Text>
      <Heading size="md" mt={4} mb={2}>
        メールアドレス
      </Heading>
      <Text>inoue@kiizan-kiizan.co.jp</Text>
      <Heading size="md" mt={4} mb={2}>
        連絡先
      </Heading>
      <Text>06-6533-2030</Text>
      <Heading size="md" mt={4} mb={2}>
        販売価格
      </Heading>
      <Text>
        飲食店の各ページにおいて表示する価格
        <br />
        ※飲食店で追加注文された場合、別途代金が発生します。
        <br />
        ※飲食店の代金はレストランにお支払いください。
      </Text>
      <Heading size="md" mt={4} mb={2}>
        支払い方法
      </Heading>
      <Text>
        クレジットカード
        <br />
        電子決済
        <br />
        現金
      </Text>
      <Heading size="md" mt={4} mb={2}>
        支払期限
      </Heading>
      <Text>
        お支払い時期
        引落し日はご利用のクレジットカードの締め日や契約内容により異なります。ご利用されるクレジットカード会社までお問い合わせください。
      </Text>
      <Heading size="md" mt={4} mb={2}>
        引渡し時期
      </Heading>
      <Text>クレジットカード決済完了時、電子決済の決済完了時。</Text>
      <Heading size="md" mt={4} mb={2}>
        キャンセル・返品
      </Heading>
      <Text>
        来店時にお店の承諾をもとに契約が締結後は、お客様都合によるキャンセル・返金・変更はお受けしておりません。
      </Text>
    </Box>
  );
}
