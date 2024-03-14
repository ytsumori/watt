import { Button } from "@chakra-ui/react";
import { FC } from "react";
import { ConvertedOrderInfo } from "../../_util/convertRequiredOrderInfo";
import { convertToBlob, getCsvBankList } from "./util";

type OrdersCsvDownloadButtonProps = { orders: ConvertedOrderInfo[] };
export const OrdersCsvDownloadButton: FC<OrdersCsvDownloadButtonProps> = ({ orders }) => {
  const onClick = () => {
    const blob = convertToBlob(getCsvBankList(orders));
    const link = document.createElement("a");
    link.download = "download.csv";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return <Button onClick={onClick}>CSVダウンロード</Button>;
};
