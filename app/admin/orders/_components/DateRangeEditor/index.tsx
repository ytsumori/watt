import { Button, Flex, Input } from "@chakra-ui/react";
import { FC } from "react";
import { onSubmit } from "./action";
import { format } from "date-fns";

type Props = { dateRange: { start: Date; end: Date } };

export const DateRangeEditor: FC<Props> = ({ dateRange }) => {
  const start = format(dateRange.start, "yyyy-MM-dd");
  const end = format(dateRange.end, "yyyy-MM-dd");
  return (
    <form action={onSubmit}>
      <Flex alignItems="center" gap={3} flexWrap="wrap">
        <Input type="date" name="start" defaultValue={start} maxWidth={150} />
        ~
        <Input type="date" name="end" defaultValue={end} maxWidth={150} />
        <Button minWidth="auto" type="submit">
          絞り込み
        </Button>
      </Flex>
    </form>
  );
};
