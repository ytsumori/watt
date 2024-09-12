import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma/client";
import { getOrderStatus } from "@/lib/prisma/order-status";
import { OrderPage } from "./_components/OrderPage";
import { format } from "date-fns";

type Params = {
  orderId: string;
};

export default async function Order({ params }: { params: Params }) {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    redirect("/");
  }
  const user = session.user;

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          googleMapPlaceId: true,
          meals: {
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              listPrice: true,
              imagePath: true,
              items: true
            }
          },
          googleMapPlaceInfo: { select: { url: true, latitude: true, longitude: true } },
          paymentOptions: true,
          exteriorImage: true,
          menuImages: true,
          openingHours: {
            select: {
              openDayOfWeek: true,
              openHour: true,
              openMinute: true,
              closeDayOfWeek: true,
              closeHour: true,
              closeMinute: true
            }
          },
          smokingOption: true,
          interiorImagePath: true
        }
      },
      meals: {
        select: {
          id: true,
          meal: { select: { title: true, price: true, listPrice: true } },
          options: {
            select: {
              id: true
            }
          }
        }
      }
    }
  });

  if (!order || order.userId !== user.id) {
    redirect("/");
  }

  const orderStatus = getOrderStatus(order);

  switch (orderStatus) {
    case "IN PROGRESS":
      return (
        <OrderPage
          order={order}
          heading="空き確認中"
          alertProps={{
            title: "お店の空き状況を確認しています",
            description: "5分以内に確認し、SMSで通知します",
            status: "warning",
            isPhoneIcon: true
          }}
          isCancelButtonVisible
        />
      );
    case "APPROVED":
      if (!order.approvedByRestaurantAt) {
        throw new Error("approvedByRestaurantAt is not set");
      }
      const arrivalDeadline = new Date(order.approvedByRestaurantAt);
      arrivalDeadline.setMinutes(arrivalDeadline.getMinutes() + 30);
      const isBeforeDeadline = Date.now() < arrivalDeadline.getTime();
      return (
        <OrderPage
          order={order}
          heading="注文完了"
          alertProps={{
            title: isBeforeDeadline
              ? `${format(arrivalDeadline, "HH:mm")}
              までにお店に向かってください`
              : "注文が完了しました",
            description: isBeforeDeadline
              ? "入店後お店の人に「Wattでの注文で」と伝え\nこちらの画面を見せてください"
              : "お食事をお楽しみください",
            status: "success"
          }}
          isHomeButtonVisible
          isCancelButtonVisible={isBeforeDeadline}
        />
      );
    case "CANCELED":
      return (
        <OrderPage
          order={order}
          heading="キャンセル済み"
          alertProps={{
            title: "こちらの注文はすでにキャンセルされています",
            status: "error"
          }}
          isHomeButtonVisible
        />
      );
    default:
      throw new Error(`Unexpected order status: ${orderStatus}`);
  }
}
