const products = [
  {
    id: "p1",
    name: "Aura SoundLink Headphones",
    price: 349.99,
    category: "audio",
    rating: 4.8,
    image: "/images/headphones.png",
    description: "Premium active noise-cancelling wireless headphones with audiophile-grade sound resolution and a seamless matte finish.",
    specs: ["Active Noise Cancening", "40-hour Battery Life", "Bluetooth 5.2", "Hi-Res Audio Certified"],
    stock: 12
  },
  {
    id: "p2",
    name: "Apex Mechanical Keyboard",
    price: 189.99,
    category: "peripherals",
    rating: 4.9,
    image: "/images/keyboard.png",
    description: "Compact 75% mechanical keyboard featuring custom linear silent switches, hot-swappable sockets, and dynamic RGB backlighting.",
    specs: ["Gateron Silent Switches", "PBT Double-Shot Keycaps", "Wireless & Wired Mode", "5-pin Hot-Swappable"],
    stock: 8
  },
  {
    id: "p3",
    name: "Horizon Curved OLED Monitor",
    price: 899.99,
    category: "displays",
    rating: 4.7,
    image: "/images/monitor.png",
    description: "34-inch ultrawide curved OLED gaming monitor delivering breathtaking colors, deep blacks, and a lightning-fast 240Hz refresh rate.",
    specs: ["3440 x 1440 resolution", "0.03ms response time", "240Hz refresh rate", "DisplayHDR True Black 400"],
    stock: 5
  },
  {
    id: "p4",
    name: "Chronos Smart Watch v2",
    price: 299.99,
    category: "wearables",
    rating: 4.6,
    image: "/images/watch.png",
    description: "Elegant health-tracking watch with a circular sapphire display, stainless steel case, and integrated GPS.",
    specs: ["Sapphire Glass", "Heart Rate & SpO2 tracker", "Built-in GPS", "7-day battery life"],
    stock: 15
  },
  {
    id: "p5",
    name: "Lumina Desk Ambient Lightbar",
    price: 79.99,
    category: "lighting",
    rating: 4.5,
    image: "/images/lightbar.png",
    description: "Smart ambient monitor lightbar with asymmetrical optical design, auto-dimming, and wireless controller.",
    specs: ["Asymmetric light path", "2700K-6500K color temp", "Wireless dial", "USB-C Powered"],
    stock: 20
  }
];

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(products)
  };
};
