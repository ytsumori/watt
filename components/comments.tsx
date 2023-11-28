"use client";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { CiShop } from "react-icons/ci";
import { IoSend } from "react-icons/io5";

export default function Comments() {
  return (
    <Accordion defaultIndex={[0, 1]} allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            おすすめのメニューは？
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel paddingTop={4}>
          <List spacing={4}>
            <ListItem>
              <HStack>
                <Avatar
                  name="Dan Abrahmov"
                  src="https://bit.ly/dan-abramov"
                  size="sm"
                />
                <Text fontSize="small">ここのカレーパン絶品です！</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <Avatar
                  name="Kent Dodds"
                  src="https://bit.ly/kent-c-dodds"
                  size="sm"
                />
                <Text fontSize="small">
                  カレーパンほんとに美味しかった！日本酒にも合います！
                </Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <Avatar
                  name="Prosper Otemuyiwa"
                  src="https://bit.ly/prosper-baba"
                  size="sm"
                />
                <Text fontSize="small">
                  餃子がオススメです！皮が厚手でモチモチ。胡椒のみで食べてみてー。
                </Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <Avatar
                  name="Ryan Florence"
                  src="https://bit.ly/ryan-florence"
                  size="sm"
                />
                <Text fontSize="small">
                  食べてみたー。めっちゃ美味しかった。酢醤油もいけます！
                </Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <Input placeholder="コメントを入力" />
                <IconButton
                  aria-label="send"
                  icon={<IoSend />}
                  textColor="white"
                  backgroundColor="cyan.400"
                />
              </HStack>
            </ListItem>
          </List>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            フリートーク
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel paddingTop={4}>
          <List spacing={4}>
            <ListItem>
              <HStack>
                <Avatar
                  name="Christian Nwamba"
                  src="https://bit.ly/code-beast"
                  size="sm"
                />
                <Text fontSize="small">
                  店員さんの寒くないですか？の声掛けがさりげなくてめっちゃ嬉しかった
                </Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <Avatar
                  bg="cyan.400"
                  size="sm"
                  icon={<CiShop fontSize="1.5rem" />}
                />
                <Text fontSize="small">
                  わー嬉しいです。これからも、さりげない声掛けに磨きをかけていきます！
                </Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <Input placeholder="コメントを入力" />
                <IconButton
                  aria-label="send"
                  icon={<IoSend />}
                  textColor="white"
                  backgroundColor="cyan.400"
                />
              </HStack>
            </ListItem>
          </List>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
