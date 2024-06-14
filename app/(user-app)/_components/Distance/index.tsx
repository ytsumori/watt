import { FC } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Text, Icon } from "@chakra-ui/react";

type Props = { distance: string };

export const Distance: FC<Props> = ({ distance }) => {
  return (
    <Text fontSize="xs" opacity={0.6}>
      <Icon as={FaMapMarkerAlt} mr={1} />
      現在地から
      {distance}
    </Text>
  );
};
