"use strict";
"use server";

/* https://developer.paypay.ne.jp/products/docs/webpayment */

const PAYPAY = require("@paypayopa/paypayopa-sdk-node");
PAYPAY.Configure({
  clientId: process.env.PAYPAY_API_KEY,
  clientSecret: process.env.PAYPAY_API_SECRET,
  merchantId: process.env.PAYPAY_MERCHANT_ID,
  /* production_mode : Set the connection destination of the sandbox environment / production environment. 
 The default false setting connects to the sandbox environment. The True setting connects to the production environment. */
  productionMode: false,
});

export async function createQRCode(merchantPaymentId: string): Promise<string> {
  // Creating the payload to create a QR Code, additional parameters can be added basis the API Documentation
  let payload = {
    merchantPaymentId: merchantPaymentId,
    amount: {
      amount: 1,
      currency: "JPY",
    },
    codeType: "ORDER_QR",
    orderDescription: "Mune's Favourite Cake",
    isAuthorization: false,
    redirectUrl: "https://paypay.ne.jp/",
    redirectType: "WEB_LINK",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1",
  };
  // Calling the method to create a qr code
  return new Promise((resolve, _reject) => {
    PAYPAY.QRCodeCreate(payload, (response: any) => {
      if (response.BODY.resultInfo.code === "SUCCESS") {
        return resolve(response.BODY.data.url);
      }
    });
  });
}

export async function deleteQRCode(codeId: string) {
  PAYPAY.QRCodeDelete(Array(codeId), (response: any) => {
    // Printing if the method call was SUCCESS
    console.log(response.BODY.resultInfo.code);
  });
}

export async function getPaymentDetails(merchantPaymentId: string) {
  // Calling the method to get payment details
  PAYPAY.GetCodePaymentDetails(merchantPaymentId, (response: any) => {
    // Printing if the method call was SUCCESS
    console.log(response.BODY.resultInfo.code);
  });
}

export async function cancelPayment(merchantPaymentId: string) {
  PAYPAY.PaymentCancel(Array(merchantPaymentId), (response: any) => {
    // Printing if the method call was SUCCESS
    console.log(response.BODY.resultInfo.code);
  });
}
