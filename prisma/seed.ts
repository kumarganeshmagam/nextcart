import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.featureFlag.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.create({
    data: {
      email: 'user@nexcart.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'user',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@nexcart.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  // Create addresses for user
  await prisma.address.create({
    data: {
      userId: user.id,
      name: 'John Doe',
      address1: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'US',
      isDefault: true,
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets, devices, and electronic accessories',
        image: 'https://picsum.photos/seed/cat-electronics/400/300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Trendy fashion and apparel for all seasons',
        image: 'https://picsum.photos/seed/cat-clothing/400/300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books',
        slug: 'books',
        description: 'Bestsellers, classics, and new releases',
        image: 'https://picsum.photos/seed/cat-books/400/300',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Everything for your home and outdoor spaces',
        image: 'https://picsum.photos/seed/cat-home/400/300',
      },
    }),
  ]);

  const [electronics, clothing, books, homeGarden] = categories;

  // Create 40 products
  const productData = [
    // Electronics (10 products)
    { name: 'Wireless Bluetooth Headphones', slug: 'wireless-bluetooth-headphones', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Features active noise cancellation, ambient sound mode, and Hi-Res audio support.', price: 149.99, stock: 45, sku: 'ELEC-001', rating: 4.5, reviewCount: 128, categoryId: electronics.id, featured: true },
    { name: 'Smart Watch Pro', slug: 'smart-watch-pro', description: 'Advanced smartwatch with health monitoring, GPS tracking, and 5-day battery life. Water resistant to 50m with always-on display.', price: 299.99, stock: 30, sku: 'ELEC-002', rating: 4.3, reviewCount: 89, categoryId: electronics.id, featured: true },
    { name: 'USB-C Hub Adapter', slug: 'usb-c-hub-adapter', description: '7-in-1 USB-C hub with HDMI 4K, USB 3.0 ports, SD card reader, and 100W power delivery passthrough.', price: 49.99, stock: 100, sku: 'ELEC-003', rating: 4.7, reviewCount: 256, categoryId: electronics.id, featured: false },
    { name: 'Portable Power Bank 20000mAh', slug: 'portable-power-bank-20000', description: 'High-capacity portable charger with quick charge 3.0 and USB-C PD. Charges 3 devices simultaneously.', price: 39.99, stock: 75, sku: 'ELEC-004', rating: 4.4, reviewCount: 167, categoryId: electronics.id, featured: false },
    { name: 'Mechanical Gaming Keyboard', slug: 'mechanical-gaming-keyboard', description: 'RGB mechanical keyboard with Cherry MX switches, programmable macros, and aircraft-grade aluminum frame.', price: 129.99, stock: 50, sku: 'ELEC-005', rating: 4.6, reviewCount: 203, categoryId: electronics.id, featured: true },
    { name: '4K Webcam Ultra HD', slug: '4k-webcam-ultra-hd', description: 'Professional 4K webcam with autofocus, noise-cancelling microphone, and automatic light correction for crystal clear video calls.', price: 89.99, stock: 35, sku: 'ELEC-006', rating: 4.2, reviewCount: 78, categoryId: electronics.id, featured: false },
    { name: 'Wireless Charging Pad', slug: 'wireless-charging-pad', description: 'Fast wireless charger compatible with all Qi-enabled devices. Supports 15W fast charging with LED indicator.', price: 24.99, stock: 120, sku: 'ELEC-007', rating: 4.1, reviewCount: 312, categoryId: electronics.id, featured: false },
    { name: 'Noise Cancelling Earbuds', slug: 'noise-cancelling-earbuds', description: 'True wireless earbuds with hybrid ANC, transparency mode, and 8-hour battery life. IPX5 water resistant.', price: 179.99, stock: 0, sku: 'ELEC-008', rating: 4.8, reviewCount: 445, categoryId: electronics.id, featured: true },
    { name: 'Smart Home Speaker', slug: 'smart-home-speaker', description: 'Voice-controlled smart speaker with premium sound, multi-room audio support, and smart home hub capabilities.', price: 99.99, stock: 65, sku: 'ELEC-009', rating: 4.0, reviewCount: 156, categoryId: electronics.id, featured: false },
    { name: 'Digital Drawing Tablet', slug: 'digital-drawing-tablet', description: 'Professional drawing tablet with 8192 pressure levels, tilt recognition, and 10x6 inch active area.', price: 199.99, stock: 25, sku: 'ELEC-010', rating: 4.5, reviewCount: 92, categoryId: electronics.id, featured: false },

    // Clothing (10 products)
    { name: 'Classic Fit Oxford Shirt', slug: 'classic-fit-oxford-shirt', description: 'Timeless Oxford button-down shirt crafted from premium cotton. Perfect for both casual and semi-formal occasions.', price: 59.99, stock: 80, sku: 'CLTH-001', rating: 4.3, reviewCount: 145, categoryId: clothing.id, featured: true },
    { name: 'Slim Fit Chino Pants', slug: 'slim-fit-chino-pants', description: 'Modern slim-fit chinos made from stretch cotton twill. Comfortable all-day wear with a clean silhouette.', price: 49.99, stock: 60, sku: 'CLTH-002', rating: 4.4, reviewCount: 198, categoryId: clothing.id, featured: false },
    { name: 'Premium Leather Jacket', slug: 'premium-leather-jacket', description: 'Genuine leather motorcycle jacket with quilted lining. Classic design meets modern craftsmanship.', price: 249.99, stock: 15, sku: 'CLTH-003', rating: 4.7, reviewCount: 67, categoryId: clothing.id, featured: true },
    { name: 'Merino Wool Sweater', slug: 'merino-wool-sweater', description: 'Ultra-soft merino wool crew neck sweater. Temperature-regulating, breathable, and naturally odor-resistant.', price: 79.99, stock: 40, sku: 'CLTH-004', rating: 4.5, reviewCount: 112, categoryId: clothing.id, featured: false },
    { name: 'Running Sneakers Pro', slug: 'running-sneakers-pro', description: 'High-performance running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole.', price: 119.99, stock: 55, sku: 'CLTH-005', rating: 4.6, reviewCount: 289, categoryId: clothing.id, featured: true },
    { name: 'Waterproof Rain Jacket', slug: 'waterproof-rain-jacket', description: 'Lightweight, packable rain jacket with sealed seams and adjustable hood. Perfect for outdoor adventures.', price: 89.99, stock: 35, sku: 'CLTH-006', rating: 4.2, reviewCount: 76, categoryId: clothing.id, featured: false },
    { name: 'Cashmere Scarf', slug: 'cashmere-scarf', description: 'Luxurious 100% cashmere scarf in classic pattern. Incredibly soft and warm, perfect for cold weather.', price: 69.99, stock: 50, sku: 'CLTH-007', rating: 4.8, reviewCount: 134, categoryId: clothing.id, featured: false },
    { name: 'Denim Trucker Jacket', slug: 'denim-trucker-jacket', description: 'Classic American denim jacket with modern fit. Washed for a lived-in look with stretch for comfort.', price: 79.99, stock: 0, sku: 'CLTH-008', rating: 4.3, reviewCount: 98, categoryId: clothing.id, featured: false },
    { name: 'Athletic Performance Shorts', slug: 'athletic-performance-shorts', description: 'Quick-dry athletic shorts with built-in liner and zippered pocket. Maximum mobility for any workout.', price: 34.99, stock: 90, sku: 'CLTH-009', rating: 4.1, reviewCount: 167, categoryId: clothing.id, featured: false },
    { name: 'Formal Dress Shoes', slug: 'formal-dress-shoes', description: 'Hand-crafted leather Oxford dress shoes with Goodyear welt construction. Elegant style for formal occasions.', price: 189.99, stock: 20, sku: 'CLTH-010', rating: 4.6, reviewCount: 53, categoryId: clothing.id, featured: false },

    // Books (10 products)
    { name: 'The Art of Clean Code', slug: 'the-art-of-clean-code', description: 'A comprehensive guide to writing maintainable, readable, and efficient code. Essential reading for every software developer.', price: 34.99, stock: 200, sku: 'BOOK-001', rating: 4.7, reviewCount: 567, categoryId: books.id, featured: true },
    { name: 'Designing Data-Intensive Apps', slug: 'designing-data-intensive-apps', description: 'Deep dive into the architecture of reliable, scalable, and maintainable systems. A modern classic for engineers.', price: 44.99, stock: 150, sku: 'BOOK-002', rating: 4.9, reviewCount: 823, categoryId: books.id, featured: true },
    { name: 'The Psychology of Money', slug: 'the-psychology-of-money', description: 'Timeless lessons on wealth, greed, and happiness. 19 short stories exploring the strange ways people think about money.', price: 19.99, stock: 300, sku: 'BOOK-003', rating: 4.5, reviewCount: 1245, categoryId: books.id, featured: false },
    { name: 'Atomic Habits', slug: 'atomic-habits', description: 'An easy and proven way to build good habits and break bad ones. Practical strategies for forming habits that stick.', price: 16.99, stock: 250, sku: 'BOOK-004', rating: 4.8, reviewCount: 2156, categoryId: books.id, featured: true },
    { name: 'Deep Work', slug: 'deep-work', description: 'Rules for focused success in a distracted world. Learn how to cultivate deep concentration for professional achievement.', price: 14.99, stock: 180, sku: 'BOOK-005', rating: 4.4, reviewCount: 678, categoryId: books.id, featured: false },
    { name: 'The Midnight Library', slug: 'the-midnight-library', description: 'A novel about all the choices that go into a life well lived. Between life and death there is a library of infinite possibilities.', price: 13.99, stock: 120, sku: 'BOOK-006', rating: 4.3, reviewCount: 945, categoryId: books.id, featured: false },
    { name: 'System Design Interview', slug: 'system-design-interview', description: 'Step-by-step framework for system design interview preparation. Covers 16 real-world system design problems.', price: 39.99, stock: 90, sku: 'BOOK-007', rating: 4.6, reviewCount: 412, categoryId: books.id, featured: false },
    { name: 'Creative Confidence', slug: 'creative-confidence', description: 'Unleashing the creative potential within us all. A practical guide to developing your creative abilities.', price: 17.99, stock: 0, sku: 'BOOK-008', rating: 4.1, reviewCount: 234, categoryId: books.id, featured: false },
    { name: 'Zero to One', slug: 'zero-to-one', description: 'Notes on startups, or how to build the future. Peter Thiel\'s contrarian framework for new ventures.', price: 15.99, stock: 160, sku: 'BOOK-009', rating: 4.2, reviewCount: 789, categoryId: books.id, featured: false },
    { name: 'The Pragmatic Programmer', slug: 'the-pragmatic-programmer', description: 'Your journey to mastery, 20th Anniversary Edition. From journeyman to master developer.', price: 49.99, stock: 85, sku: 'BOOK-010', rating: 4.8, reviewCount: 634, categoryId: books.id, featured: false },

    // Home & Garden (10 products)
    { name: 'Smart LED Desk Lamp', slug: 'smart-led-desk-lamp', description: 'Adjustable LED desk lamp with 5 color temperatures, touch controls, and USB charging port. Reduces eye strain.', price: 45.99, stock: 70, sku: 'HOME-001', rating: 4.4, reviewCount: 189, categoryId: homeGarden.id, featured: true },
    { name: 'Ceramic Plant Pot Set', slug: 'ceramic-plant-pot-set', description: 'Set of 3 minimalist ceramic plant pots with drainage holes and bamboo trays. Modern matte finish.', price: 29.99, stock: 55, sku: 'HOME-002', rating: 4.6, reviewCount: 267, categoryId: homeGarden.id, featured: false },
    { name: 'Memory Foam Pillow', slug: 'memory-foam-pillow', description: 'Contoured memory foam pillow with cooling gel layer. Ergonomic design for proper neck and spine alignment.', price: 39.99, stock: 100, sku: 'HOME-003', rating: 4.3, reviewCount: 345, categoryId: homeGarden.id, featured: false },
    { name: 'Stainless Steel Cookware Set', slug: 'stainless-steel-cookware-set', description: '10-piece tri-ply stainless steel cookware set. Oven safe, dishwasher safe, induction compatible.', price: 199.99, stock: 25, sku: 'HOME-004', rating: 4.7, reviewCount: 156, categoryId: homeGarden.id, featured: true },
    { name: 'Bamboo Cutting Board Set', slug: 'bamboo-cutting-board-set', description: 'Set of 3 organic bamboo cutting boards in different sizes. Naturally antimicrobial and knife-friendly.', price: 24.99, stock: 85, sku: 'HOME-005', rating: 4.5, reviewCount: 298, categoryId: homeGarden.id, featured: false },
    { name: 'Essential Oil Diffuser', slug: 'essential-oil-diffuser', description: 'Ultrasonic aromatherapy diffuser with 7 LED color modes and 300ml capacity. Whisper-quiet operation.', price: 34.99, stock: 60, sku: 'HOME-006', rating: 4.2, reviewCount: 412, categoryId: homeGarden.id, featured: false },
    { name: 'Garden Tool Set', slug: 'garden-tool-set', description: 'Premium 12-piece garden tool set with ergonomic handles. Includes trowel, pruner, weeder, and carrying bag.', price: 54.99, stock: 40, sku: 'HOME-007', rating: 4.4, reviewCount: 87, categoryId: homeGarden.id, featured: false },
    { name: 'Weighted Blanket 15lb', slug: 'weighted-blanket-15lb', description: 'Premium weighted blanket with glass bead fill and breathable cotton cover. Promotes better sleep quality.', price: 69.99, stock: 0, sku: 'HOME-008', rating: 4.6, reviewCount: 534, categoryId: homeGarden.id, featured: false },
    { name: 'Automatic Soap Dispenser', slug: 'automatic-soap-dispenser', description: 'Touchless infrared soap dispenser with adjustable volume control. Sleek stainless steel design.', price: 19.99, stock: 110, sku: 'HOME-009', rating: 4.0, reviewCount: 156, categoryId: homeGarden.id, featured: false },
    { name: 'Indoor Herb Garden Kit', slug: 'indoor-herb-garden-kit', description: 'Complete indoor herb growing kit with LED grow light, self-watering planter, and 6 herb seed pods.', price: 59.99, stock: 45, sku: 'HOME-010', rating: 4.5, reviewCount: 178, categoryId: homeGarden.id, featured: true },
  ];

  const products = await Promise.all(
    productData.map((p, i) =>
      prisma.product.create({
        data: {
          ...p,
          images: JSON.stringify([
            `https://picsum.photos/seed/product-${i + 1}-main/400/400`,
            `https://picsum.photos/seed/product-${i + 1}-alt1/400/400`,
            `https://picsum.photos/seed/product-${i + 1}-alt2/400/400`,
          ]),
        },
      })
    )
  );

  // Create coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'SAVE10', discountPercent: 10, active: true, expiresAt: new Date('2027-12-31') },
      { code: 'NEXCART20', discountPercent: 20, active: true, expiresAt: new Date('2027-12-31') },
    ],
  });

  // Create orders for regular user
  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'Delivered',
      subtotal: 199.98,
      tax: 16.00,
      shippingCost: 0,
      total: 215.98,
      shippingMethod: 'Standard',
      shippingAddress: JSON.stringify({
        name: 'John Doe',
        address1: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        country: 'US',
      }),
      items: {
        create: [
          { productId: products[0].id, quantity: 1, price: 149.99 },
          { productId: products[6].id, quantity: 2, price: 24.99 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'Shipped',
      subtotal: 299.99,
      tax: 24.00,
      shippingCost: 9.99,
      total: 333.98,
      shippingMethod: 'Express',
      shippingAddress: JSON.stringify({
        name: 'John Doe',
        address1: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        country: 'US',
      }),
      items: {
        create: [
          { productId: products[1].id, quantity: 1, price: 299.99 },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'Pending',
      subtotal: 94.98,
      tax: 7.60,
      shippingCost: 0,
      total: 102.58,
      shippingMethod: 'Standard',
      couponCode: 'SAVE10',
      discountAmount: 9.50,
      shippingAddress: JSON.stringify({
        name: 'John Doe',
        address1: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        country: 'US',
      }),
      items: {
        create: [
          { productId: products[20].id, quantity: 1, price: 34.99 },
          { productId: products[10].id, quantity: 1, price: 59.99 },
        ],
      },
    },
  });

  // Create reviews
  await prisma.review.createMany({
    data: [
      { userId: user.id, productId: products[0].id, rating: 5, comment: 'Absolutely amazing sound quality! The noise cancellation is top-notch and battery life exceeds expectations.' },
      { userId: user.id, productId: products[1].id, rating: 4, comment: 'Great smartwatch with excellent health features. The GPS accuracy could be slightly better during trails.' },
      { userId: admin.id, productId: products[4].id, rating: 5, comment: 'Best keyboard I have ever used. The Cherry MX switches feel incredible and the build quality is premium.' },
      { userId: admin.id, productId: products[20].id, rating: 5, comment: 'This book transformed how I write code. Every developer should read this at least once.' },
      { userId: user.id, productId: products[30].id, rating: 4, comment: 'Beautiful desk lamp with great functionality. The USB port is a nice touch. Slightly bright at lowest setting.' },
    ],
  });

  // Create feature flags
  await prisma.featureFlag.createMany({
    data: [
      { key: 'enable_reviews', enabled: true, description: 'Enable product reviews and ratings' },
      { key: 'enable_coupons', enabled: true, description: 'Enable coupon code functionality' },
      { key: 'enable_express_shipping', enabled: true, description: 'Enable express and overnight shipping options' },
      { key: 'maintenance_mode', enabled: false, description: 'Put the site in maintenance mode' },
    ],
  });

  console.log('✅ Seed complete!');
  console.log(`   Created ${categories.length} categories`);
  console.log(`   Created ${products.length} products`);
  console.log(`   Created 2 users (user@nexcart.com, admin@nexcart.com)`);
  console.log(`   Created 3 orders`);
  console.log(`   Created 2 coupons (SAVE10, NEXCART20)`);
  console.log(`   Created 5 reviews`);
  console.log(`   Created 4 feature flags`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
