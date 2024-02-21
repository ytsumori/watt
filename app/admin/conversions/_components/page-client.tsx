"use client";

import { ConversionTrackingTag } from "@prisma/client";
import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
  useToast,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { InfoOutlineIcon } from "@chakra-ui/icons";

type Props = {
  conversionTags: ConversionTrackingTag[];
};

export function ConversionsPage({ conversionTags }: Props) {
  const toast = useToast();
  return (
    <Box p={6}>
      <Link as={NextLink} href="/admin/conversions/new">
        <Button size="md">新規作成</Button>
      </Link>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>名前</Th>
              <Th>タグ</Th>
              <Th>
                登録用URL
                <Tooltip label="クリックでURLをコピー出来ます">
                  <InfoOutlineIcon mx="2px" />
                </Tooltip>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {conversionTags.map((tag) => {
              const registrationUrl = `${process.env.NEXT_PUBLIC_HOST_URL}?ctt=${tag.tag}`;
              const handleCopy = () => {
                navigator.clipboard.writeText(registrationUrl);
                toast({
                  title: "コピーしました",
                  status: "success",
                  duration: 2000,
                });
              };
              return (
                <Tr key={tag.id}>
                  <Td>{tag.title}</Td>
                  <Td>{tag.tag}</Td>
                  <Td>
                    <Input
                      value={registrationUrl}
                      isReadOnly
                      onClick={handleCopy}
                      cursor="pointer"
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
