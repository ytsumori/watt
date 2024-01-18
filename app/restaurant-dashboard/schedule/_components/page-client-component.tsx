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
import { ChangeEvent, useContext, useEffect, useState } from "react";
import {
  createOpenHour,
  deleteOpenHour,
  getOpenHours,
  updateOpenHour,
} from "@/actions/restaurant-open-hour";
import { DayOfWeek, RestaurantOpenHour } from "@prisma/client";
import { findRestaurant, updateIsOpen } from "@/actions/restaurant";
import { RestaurantIdContext } from "../../_components/dashboard-layout";

export function DashboardSchedule() {
  const restaurantId = useContext(RestaurantIdContext);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>();
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(false);
  const [openHours, setOpenHours] = useState<RestaurantOpenHour[]>([]);
  const [editingOpenHourId, setEditingOpenHourId] = useState<string>();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose,
  } = useDisclosure({
    defaultIsOpen: editingOpenHourId !== undefined,
    onClose: () => {
      setDayOfWeek(undefined);
      setStartTime(undefined);
      setEndTime(undefined);
    },
  });
  useEffect(() => {
    findRestaurant(restaurantId).then((restaurant) => {
      if (!restaurant) throw new Error("Restaurant not found");
      setIsRestaurantOpen(restaurant.isOpen);
    });
    getOpenHours({ restaurantId }).then((openHours) => setOpenHours(openHours));
  }, [restaurantId]);

  const formattedEvents = openHours.map((openHour) => toEventInput(openHour));

  const handleOpenStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isOpen = event.target.checked;
    updateIsOpen({ id: restaurantId, isOpen }).then(() => {
      setIsRestaurantOpen(isOpen);
    });
  };

  const handleSubmit = () => {
    if (!(dayOfWeek && startTime && endTime)) return;

    if (editingOpenHourId) {
      updateOpenHour({
        id: editingOpenHourId,
        day: dayOfWeek,
        startHour: Number(startTime.split(":")[0]),
        startMinute: Number(startTime.split(":")[1]),
        endHour: Number(endTime.split(":")[0]),
        endMinute: Number(endTime.split(":")[1]),
      }).then((result) => {
        const newOpenHours = [...openHours];
        const editingIndex = newOpenHours.findIndex(
          (openHour) => openHour.id === result.id
        );
        newOpenHours[editingIndex] = result;
        setOpenHours(newOpenHours);
        setEditingOpenHourId(undefined);
        onClose();
      });
    } else {
      createOpenHour({
        restaurantId,
        day: dayOfWeek,
        startHour: Number(startTime.split(":")[0]),
        startMinute: Number(startTime.split(":")[1]),
        endHour: Number(endTime.split(":")[0]),
        endMinute: Number(endTime.split(":")[1]),
      }).then((result) => {
        const newOpenHours = [...openHours, result];
        setOpenHours(newOpenHours);
        onClose();
      });
    }
  };

  const handleDelete = () => {
    if (!editingOpenHourId) return;

    deleteOpenHour({
      id: editingOpenHourId,
    }).then((result) => {
      const newOpenHours = [...openHours];
      const removingIndex = newOpenHours.findIndex(
        (openHour) => openHour.id === result.id
      );
      newOpenHours.splice(removingIndex, 1);
      setOpenHours(newOpenHours);
      setEditingOpenHourId(undefined);
      onClose();
    });
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
        eventClick={(info) => {
          if (!(info.event.start && info.event.end)) return;
          setDayOfWeek(toDayOfWeek(info.event.start.getDay()));
          setStartTime(
            info.event.start.toLocaleTimeString("ja-JP").padStart(8, "0")
          );
          setEndTime(
            info.event.end.toLocaleTimeString("ja-JP").padStart(8, "0")
          );
          setEditingOpenHourId(info.event.id);
          onModalOpen();
        }}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setEditingOpenHourId(undefined);
          onClose();
        }}
      >
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
            {editingOpenHourId && (
              <Button onClick={handleDelete} colorScheme="red" mr="auto">
                削除
              </Button>
            )}
            <Button onClick={onClose} variant="outline" mr={3}>
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              textColor="white"
              isDisabled={
                !(dayOfWeek && startTime && endTime && startTime < endTime)
              }
            >
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function toEventInput(openHour: RestaurantOpenHour): EventInput {
  const today = new Date();
  const currentDay = today.getDay();
  const day = toNumber(openHour.day);
  const diff = day - currentDay;
  const date = new Date(today.getTime() + diff * 24 * 60 * 60 * 1000);
  const start = new Date(
    `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${openHour.startHour
      .toString()
      .padStart(2, "0")}:${openHour.startMinute.toString().padStart(2, "0")}`
  );
  const end = new Date(
    `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${openHour.endHour
      .toString()
      .padStart(2, "0")}: ${openHour.endMinute.toString().padStart(2, "0")}`
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
