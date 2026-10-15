import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/lib/woocommerce";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      billing,
      shipping,
      line_items,
      payment_method,
      shipping_method,
      shipping_cost,
      customer_note,
      customer_id: bodyCustomerId,
      coupon_lines,
      coupon_code,
    } = body || {};

    let customerId = bodyCustomerId ? parseInt(bodyCustomerId, 10) : 0;
    let sessionEmail = "";
    try {
      const cookieStore = await cookies();
      const session = cookieStore.get("shopzen_session");
      if (session?.value) {
        const user = JSON.parse(session.value);
        if (!customerId && user?.id) {
          customerId = parseInt(user.id, 10) || 0;
        }
        if (user?.email) {
          sessionEmail = user.email;
        }
      }
    } catch (e) {
      console.warn("Failed to read user session in create-order:", e);
    }

    const rawBilling = billing || {};
    const rawShipping = shipping || {};

    // Validate email
    const email = (rawBilling.email || rawShipping.email || sessionEmail || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid email address is required to place an order.",
        },
        { status: 400 }
      );
    }

    // Validate and sanitize line items
    const rawLineItems = Array.isArray(line_items) ? line_items : [];
    const validLineItems = rawLineItems
      .map((item: any) => ({
        product_id: parseInt(String(item.product_id || item.id || ""), 10),
        quantity: Math.max(1, parseInt(String(item.quantity || "1"), 10) || 1),
      }))
      .filter((item: any) => Number.isInteger(item.product_id) && item.product_id > 0);

    if (validLineItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty or contains invalid items. Please add items before checking out.",
        },
        { status: 400 }
      );
    }

    const firstName = (rawBilling.firstName || rawBilling.first_name || rawShipping.firstName || rawShipping.first_name || "").trim();
    const lastName = (rawBilling.lastName || rawBilling.last_name || rawShipping.lastName || rawShipping.last_name || "").trim();
    const phone = (rawBilling.phone || rawShipping.phone || "").trim();
    const address1 = (rawShipping.address1 || rawShipping.address_1 || rawBilling.address1 || rawBilling.address_1 || "").trim();
    const address2 = (rawShipping.address2 || rawShipping.address_2 || rawBilling.address2 || rawBilling.address_2 || "").trim();
    const city = (rawShipping.city || rawBilling.city || "").trim();
    const state = (rawShipping.state || rawBilling.state || "").trim();
    const postcode = (rawShipping.postcode || rawBilling.postcode || "").trim();
    const country = rawShipping.country || rawBilling.country || "IN";

    const calcShippingCost = typeof shipping_cost === "number"
      ? shipping_cost.toFixed(2)
      : shipping_method === "express"
      ? "199.00"
      : "99.00";

    const orderData: Record<string, any> = {
      customer_id: customerId > 0 ? customerId : 0,
      billing: {
        first_name: firstName,
        last_name: lastName,
        address_1: address1,
        address_2: address2,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
        email: email,
        phone: phone,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: address1,
        address_2: address2,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
        phone: phone,
      },
      line_items: validLineItems,
      payment_method: payment_method === "cod" ? "cod" : "razorpay",
      payment_method_title: payment_method === "cod" ? "Cash on Delivery" : "Razorpay",
      set_paid: payment_method === "cod",
      status: payment_method === "cod" ? "processing" : "pending",
      shipping_lines: [
        {
          method_id: shipping_method || "flat_rate",
          method_title: shipping_method === "express" ? "Express Shipping" : "Standard Shipping",
          total: calcShippingCost,
        },
      ],
      customer_note: customer_note || "",
      ...(Array.isArray(coupon_lines) && coupon_lines.length > 0
        ? { coupon_lines }
        : coupon_code
        ? { coupon_lines: [{ code: coupon_code }] }
        : {}),
    };

    let response;
    try {
      response = await api.post("orders", orderData);
    } catch (orderErr: any) {
      // If customer_id was rejected as invalid, fallback to guest order (customer_id: 0)
      if (
        customerId > 0 &&
        (orderErr?.response?.data?.code === "woocommerce_rest_invalid_customer_id" ||
          orderErr?.response?.data?.message?.includes("Customer ID is invalid"))
      ) {
        console.warn(`Customer ID ${customerId} rejected by WooCommerce. Retrying as guest order.`);
        orderData.customer_id = 0;
        response = await api.post("orders", orderData);
      } else {
        throw orderErr;
      }
    }

    return NextResponse.json({
      success: true,
      orderId: response.data.id,
      orderNumber: response.data.number,
      status: response.data.status,
    });
  } catch (error: any) {
    console.error("Error creating order:", error?.response?.data || error?.message || error);
    const wcData = error?.response?.data;
    let message = "Failed to create order. Please try again.";

    if (wcData) {
      if (typeof wcData.message === "string") {
        message = wcData.message.replace(/<[^>]*>/g, "").trim();
      }
      if (wcData.data?.params) {
        const paramErrors = Object.entries(wcData.data.params)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
        if (paramErrors) {
          message = `Invalid order details (${paramErrors})`;
        }
      }
    } else if (error?.message) {
      message = error.message;
    }

    return NextResponse.json(
      { success: false, message },
      { status: error?.response?.status || 500 }
    );
  }
}
