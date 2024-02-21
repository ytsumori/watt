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
import { copySignUpURL } from "../../_util/clipboard-text";

export function NewRestaurantPageClient() {
  const [selectedPlace, setSelectedPlace] = useState<SearchPlaceResult>();
  const [searchText, setSearchText] = useState<string>();
  const [searchResults, setSearchResults] = useState<SearchPlaceResult[]>();
  const [submitResult, setSubmitResult] = useState<{
    id: string;
    password: string;
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
        setSubmitResult({ id: result.id, password: result.password });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCopy = () => {
    if (!submitResult) return;
    copySignUpURL(submitResult);
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
          <Button isDisabled={!searchText} onClick={handleSearchClick}>
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
                <Button onClick={() => setSelectedPlace(result)}>
                  この店を登録する
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
      <Modal
        isOpen={!!selectedPlace}
        onClose={() => {
          setSelectedPlace(undefined);
          setSubmitResult(undefined);
        }}
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
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  {submitResult ? (
                    <Popover isOpen={isCopiedOpen}>
                      <PopoverTrigger>
                        <Button onClick={handleCopy} mr={3}>
                          登録用URLをコピー
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverHeader>コピーしました!</PopoverHeader>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Button onClick={handleSubmit} mr={3}>
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
