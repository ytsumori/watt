"use client";

import { createRestaurant } from "@/actions/restaurant";
import { SearchPlaceResult, searchPlaces } from "@/lib/places-api";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  VStack,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
} from "@chakra-ui/react";
import { useState } from "react";
import { copyCredentialToClipboard } from "../../_util/clipboard-text";

export function NewRestaurantPage() {
  const [selectedPlace, setSelectedPlace] = useState<SearchPlaceResult>();
  const [searchText, setSearchText] = useState<string>();
  const [searchResults, setSearchResults] = useState<SearchPlaceResult[]>();
  const [submitResult, setSubmitResult] = useState<{
    id: string;
    token: string;
  }>();
  const {
    isOpen: isCopiedOpen,
    onToggle: onCopiedToggle,
    onClose: onCopiedClose,
  } = useDisclosure();

  const handleSearchClick = () => {
    if (!searchText) return;
    searchPlaces({ text: searchText }).then((result) => {
      setSearchResults(result.places);
    });
  };

  const handleSubmit = () => {
    if (!selectedPlace) return;
    createRestaurant({
      name: selectedPlace.displayName.text,
      googleMapPlaceId: selectedPlace.id,
    })
      .then((result) => {
        setSubmitResult({ id: result.id, token: result.tokens[0].token });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCopy = () => {
    if (!submitResult) return;
    copyCredentialToClipboard({
      id: submitResult.id,
      password: submitResult.token,
    });
    onCopiedToggle();
    setTimeout(onCopiedClose, 2000);
  };

  return (
    <>
      <VStack height="100vh" p={6}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Googleマップで検索</FormLabel>
            <Input
              onChange={(e) => setSearchText(e.target.value ?? undefined)}
              value={searchText ?? ""}
            />
          </FormControl>
          <Button
            textColor="white"
            isDisabled={!searchText}
            onClick={handleSearchClick}
          >
            検索する
          </Button>
        </VStack>

        <SimpleGrid
          maxWidth="100vw"
          columns={{ base: 2, md: 3 }}
          spacing={4}
          overflowY="auto"
        >
          {searchResults?.map((result) => (
            <Card key={result.id} w="full">
              <CardBody>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=place_id:${result.id}`}
                />
              </CardBody>
              <CardFooter>
                <Button
                  textColor="white"
                  onClick={() => setSelectedPlace(result)}
                >
                  この店を登録する
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
      <Modal
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(undefined)}
      >
        <ModalOverlay />
        {selectedPlace && (
          <ModalContent>
            {
              <>
                <ModalHeader>店舗登録</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>店名</FormLabel>
                      <Input
                        isReadOnly
                        value={selectedPlace.displayName.text ?? ""}
                      />
                    </FormControl>
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=place_id:${selectedPlace.id}`}
                    />
                    {submitResult && (
                      <>
                        <FormControl>
                          <FormLabel>ID</FormLabel>
                          <Input isReadOnly value={submitResult.id} />
                        </FormControl>
                        <FormControl>
                          <FormLabel>パスワード</FormLabel>
                          <Input
                            isReadOnly
                            value={submitResult.token}
                            type="password"
                          />
                        </FormControl>
                      </>
                    )}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  {submitResult ? (
                    <Popover isOpen={isCopiedOpen}>
                      <PopoverTrigger>
                        <Button textColor="white" onClick={handleCopy} mr={3}>
                          共有用テキストをコピー
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverHeader>コピーしました!</PopoverHeader>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Button textColor="white" onClick={handleSubmit} mr={3}>
                      登録する
                    </Button>
                  )}
                </ModalFooter>
              </>
            }
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
