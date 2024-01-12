"use client";

import { EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { createOpenHour } from "@/actions/restaurantOpenHour";
import { DayOfWeek } from "@prisma/client";
import { updateIsOpen } from "@/actions/restaurant";

type OpenHour = {
  id: string;
  day: number;
  start: string;
  end: string;
};

type Props = {
  restaurantId: string;
  defaultIsOpen: boolean;
  defaultOpenHours: OpenHour[];
};

export function DashboardSchedule({
  restaurantId,
  defaultIsOpen,
  defaultOpenHours,
}: Props) {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>();
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(defaultIsOpen);
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose,
  } = useDisclosure({
    onClose: () => {
      setDayOfWeek(undefined);
      setStartTime(undefined);
      setEndTime(undefined);
    },
  });

  const formattedEvents = defaultOpenHours.map((openHour) =>
    toEventInput(openHour)
  );

  const handleOpenStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isOpen = event.target.checked;
    updateIsOpen({ id: restaurantId, isOpen }).then(() => {
      setIsRestaurantOpen(isOpen);
    });
  };

  const handleSubmit = () => {
    if (dayOfWeek && startTime && endTime) {
      createOpenHour({
        restaurantId,
        day: dayOfWeek,
        startTime,
        endTime,
      }).then(onClose);
    }
  };

  return (
    <>
      <FormControl>
        <HStack>
          <FormLabel mb={0}>営業中</FormLabel>
          <Switch
            onChange={handleOpenStatusChange}
            isChecked={isRestaurantOpen}
          />
        </HStack>
        <FormHelperText>
          お客さんを案内できない場合はオフにしてください
        </FormHelperText>
      </FormControl>
      <Heading mt={6}>営業時間</Heading>
      <Alert status="info" size="">
        <AlertIcon />
        営業時間を登録することで、自動で営業中ステータスに変更されます
      </Alert>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        allDaySlot={false}
        slotEventOverlap={false}
        nowIndicator
        events={formattedEvents}
        height="auto"
        dayHeaderFormat={{ weekday: "long" }}
        editable={true}
        locale="ja"
        headerToolbar={{
          left: "",
          center: "",
          right: "",
        }}
        eventOverlap={false}
        dateClick={(info) => {
          const endDate = new Date(info.date);
          endDate.setMinutes(endDate.getMinutes() + 30);
          setDayOfWeek(toDayOfWeek(info.date.getDay()));
          setStartTime(info.date.toLocaleTimeString("ja-JP").padStart(8, "0"));
          setEndTime(endDate.toLocaleTimeString("ja-JP").padStart(8, "0"));
          onModalOpen();
        }}
      />
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>営業時間を追加</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>曜日</FormLabel>
              <Select
                placeholder="曜日を選択"
                value={dayOfWeek ? toNumber(dayOfWeek).toString() : ""}
                onChange={(e) =>
                  setDayOfWeek(toDayOfWeek(Number(e.target.value)))
                }
              >
                <option value="0">日曜日</option>
                <option value="1">月曜日</option>
                <option value="2">火曜日</option>
                <option value="3">水曜日</option>
                <option value="4">木曜日</option>
                <option value="5">金曜日</option>
                <option value="6">土曜日</option>
              </Select>
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel>開始時間</FormLabel>
              <Input
                placeholder="時間を選択"
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(
                    e.target.value !== "" ? e.target.value : undefined
                  )
                }
              />
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel>終了時間</FormLabel>
              <Input
                placeholder="時間を選択"
                type="time"
                value={endTime}
                onChange={(e) =>
                  setEndTime(e.target.value !== "" ? e.target.value : undefined)
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={handleSubmit}
              textColor="white"
              isDisabled={
                !(dayOfWeek && startTime && endTime && startTime < endTime)
              }
            >
              保存
            </Button>
            <Button onClick={onClose} variant="outline">
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function toEventInput(openHour: OpenHour): EventInput {
  const today = new Date();
  const currentDay = today.getDay();
  const day = openHour.day - 1;
  const diff = day - currentDay;
  const date = new Date(today.getTime() + diff * 24 * 60 * 60 * 1000);
  const start = new Date(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${
      openHour.start
    }`
  );
  const end = new Date(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${
      openHour.end
    }`
  );
  return {
    id: openHour.id,
    start,
    end,
  };
}

function toNumber(value: DayOfWeek): number {
  switch (value) {
    case "SUNDAY":
      return 0;
    case "MONDAY":
      return 1;
    case "TUESDAY":
      return 2;
    case "WEDNESDAY":
      return 3;
    case "THURSDAY":
      return 4;
    case "FRIDAY":
      return 5;
    case "SATURDAY":
      return 6;
    default:
      throw new Error("Invalid day of week");
  }
}

function toDayOfWeek(value: number): DayOfWeek {
  switch (value) {
    case 0:
      return "SUNDAY";
    case 1:
      return "MONDAY";
    case 2:
      return "TUESDAY";
    case 3:
      return "WEDNESDAY";
    case 4:
      return "THURSDAY";
    case 5:
      return "FRIDAY";
    case 6:
      return "SATURDAY";
    default:
      throw new Error("Invalid day of week");
  }
}
