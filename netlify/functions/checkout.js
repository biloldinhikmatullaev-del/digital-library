exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const { items, customer, total } = payload;

    if (!items || !customer || !total) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ error: "Missing required fields (items, customer, or total)" })
      };
    }

    // Simulate database delay or payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderId = "ORD-" + Math.random().toString(36).substring(2, 11).toUpperCase();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({
        success: true,
        orderId,
        message: "Order placed successfully!",
        deliveryEstimate: "3-5 business days",
        total
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: "Internal Server Error: " + error.message })
    };
  }
};
