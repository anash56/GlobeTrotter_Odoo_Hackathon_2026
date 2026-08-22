import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cities = [
  {
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    description: 'The City of Light, world-famous for art, gastronomy, culture, iconic landmarks like the Eiffel Tower, and Romantic strolls along the Seine.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Luxury',
    avgDailyCost: 180.0,
    popularityScore: 4.9,
    activities: [
      { name: 'Eiffel Tower Sunset Experience', category: 'Sightseeing', description: 'Marvel at panoramic views of Paris as the sun sets over the Seine.', estimatedCost: 35.0, durationHours: 2.5 },
      { name: 'Louvre Museum Guided Tour', category: 'Culture', description: 'Explore Mona Lisa and thousands of world masterpiece artworks.', estimatedCost: 45.0, durationHours: 3.0 },
      { name: 'Seine River Evening Cruise', category: 'Relaxation', description: 'Glide past illuminated monuments with champagne.', estimatedCost: 28.0, durationHours: 1.5 },
    ]
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    description: 'A captivating metropolis blending ultramodern skyscrapers with neon lights, ancient historic temples, world-class culinary mastery, and pop culture.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Moderate',
    avgDailyCost: 140.0,
    popularityScore: 5.0,
    activities: [
      { name: 'Shibuya Crossing & Harajuku Exploration', category: 'Sightseeing', description: 'Experience the world busiest intersection and vibrant youth culture.', estimatedCost: 10.0, durationHours: 3.0 },
      { name: 'Sensō-ji Temple Historic Walk', category: 'Culture', description: 'Visit Asakusa historic district and Tokyo oldest Buddhist temple.', estimatedCost: 0.0, durationHours: 2.0 },
      { name: 'Tsukiji Outer Market Food Tour', category: 'Food', description: 'Taste fresh sushi, wagyu beef skewers, and traditional matcha.', estimatedCost: 50.0, durationHours: 2.5 },
    ]
  },
  {
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    description: 'The Eternal City boasts nearly three millennia of globally influential art, architecture, ancient ruins like the Colosseum, and vibrant piazza lifestyle.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Moderate',
    avgDailyCost: 130.0,
    popularityScore: 4.8,
    activities: [
      { name: 'Colosseum & Roman Forum Tour', category: 'Sightseeing', description: 'Walk through ancient gladiatorial arenas and imperial ruins.', estimatedCost: 40.0, durationHours: 3.5 },
      { name: 'Vatican Museums & Sistine Chapel', category: 'Culture', description: 'Admire Michelangelo ceiling frescoes and papal art treasures.', estimatedCost: 48.0, durationHours: 4.0 },
      { name: 'Trastevere Food & Wine Walk', category: 'Food', description: 'Savor authentic carbonara, gelato, and Italian wines.', estimatedCost: 55.0, durationHours: 3.0 },
    ]
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    description: 'Tropical paradise renowned for volcanic mountains, iconic rice terraces, serene beaches, coral reefs, spiritual retreats, and rich Balinese heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Budget',
    avgDailyCost: 65.0,
    popularityScore: 4.9,
    activities: [
      { name: 'Ubud Rice Terraces & Swing', category: 'Adventure', description: 'Swing over lush green jungle valleys and Tegallalang rice paddies.', estimatedCost: 20.0, durationHours: 3.0 },
      { name: 'Uluwatu Sunset Temple & Kecak Fire Dance', category: 'Culture', description: 'Watch dramatic cliffside traditional performance at sunset.', estimatedCost: 15.0, durationHours: 2.5 },
      { name: 'Seminyak Beach Club Relaxation', category: 'Relaxation', description: 'Unwind with coconut drinks and ocean sunset music vibes.', estimatedCost: 30.0, durationHours: 4.0 },
    ]
  },
  {
    name: 'New York City',
    country: 'United States',
    region: 'North America',
    description: 'The city that never sleeps, featuring iconic skyscrapers, Times Square neon, Broadway theater, Central Park, and diverse global neighborhoods.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Luxury',
    avgDailyCost: 210.0,
    popularityScore: 4.8,
    activities: [
      { name: 'Central Park Bike Tour', category: 'Sightseeing', description: 'Cycle past Bethesda Fountain, Strawberry Fields, and Bow Bridge.', estimatedCost: 25.0, durationHours: 2.0 },
      { name: 'Top of the Rock Observatory', category: 'Sightseeing', description: 'Panoramic 360 views of Empire State Building and Manhattan skyline.', estimatedCost: 44.0, durationHours: 1.5 },
      { name: 'Broadway Musical Show', category: 'Culture', description: 'Enjoy award-winning live theatrical performances on Broadway.', estimatedCost: 110.0, durationHours: 3.0 },
    ]
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    description: 'Vibrant Mediterranean hub famous for Antoni Gaudí architecture like Sagrada Família, sunny beaches, tapas bars, and bustling Gothic Quarter.',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Moderate',
    avgDailyCost: 125.0,
    popularityScore: 4.7,
    activities: [
      { name: 'Sagrada Família Skip-the-Line Tour', category: 'Sightseeing', description: 'Marvel at Gaudí towering basilica and kaleidoscopic stained glass.', estimatedCost: 32.0, durationHours: 2.0 },
      { name: 'Park Güell & Gràcia Walk', category: 'Culture', description: 'Explore colorful mosaic park benches overlooking the city.', estimatedCost: 18.0, durationHours: 2.5 },
      { name: 'Gothic Quarter Tapas & Wine Tasting', category: 'Food', description: 'Sample Iberian ham, patatas bravas, sangria, and local wines.', estimatedCost: 42.0, durationHours: 2.5 },
    ]
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    description: 'City of superlatives known for luxury shopping, ultramodern architecture, desert safaris, world-record skyscrapers like Burj Khalifa, and nightlife.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Luxury',
    avgDailyCost: 195.0,
    popularityScore: 4.7,
    activities: [
      { name: 'Burj Khalifa 124th Floor Observation Deck', category: 'Sightseeing', description: 'Stand at top of the tallest building in the world.', estimatedCost: 55.0, durationHours: 2.0 },
      { name: 'Desert Safari with BBQ & Dune Bashing', category: 'Adventure', description: '4x4 dune bashing, camel riding, and starlit Bedouin dinner.', estimatedCost: 65.0, durationHours: 6.0 },
      { name: 'Dubai Marina Yacht Sunset Cruise', category: 'Relaxation', description: 'Sail past luxury skyscrapers and Palm Jumeirah.', estimatedCost: 75.0, durationHours: 2.0 },
    ]
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    description: 'Picturesque city of historic canals, gabled houses, world-class museums like Van Gogh Museum, vibrant cycling culture, and tulip fields.',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80',
    costIndex: 'Moderate',
    avgDailyCost: 135.0,
    popularityScore: 4.8,
    activities: [
      { name: 'UNESCO Canal Cruise by Open Boat', category: 'Sightseeing', description: 'Navigate historic 17th-century waterways with local guide.', estimatedCost: 22.0, durationHours: 1.5 },
      { name: 'Rijksmuseum & Van Gogh Museum Tour', category: 'Culture', description: 'Discover Dutch Masters paintings by Rembrandt and Van Gogh.', estimatedCost: 45.0, durationHours: 3.5 },
      { name: 'Jordaan District Bike & Café Tour', category: 'Relaxation', description: 'Cycle through narrow streets, boutiques, and cozy brown cafés.', estimatedCost: 28.0, durationHours: 2.5 },
    ]
  }
];

async function main() {
  console.log('Seeding database with destination cities and activities...');

  for (const c of cities) {
    const { activities, ...cityData } = c;

    const existing = await prisma.city.findFirst({
      where: { name: cityData.name, country: cityData.country }
    });

    let cityId;
    if (existing) {
      console.log(`Updating existing city: ${cityData.name}, ${cityData.country}`);
      const updated = await prisma.city.update({
        where: { id: existing.id },
        data: cityData
      });
      cityId = updated.id;
    } else {
      console.log(`Creating city: ${cityData.name}, ${cityData.country}`);
      const created = await prisma.city.create({
        data: cityData
      });
      cityId = created.id;
    }

    // Seed activities
    for (const act of activities) {
      const existingAct = await prisma.activity.findFirst({
        where: { cityId, name: act.name }
      });
      if (!existingAct) {
        await prisma.activity.create({
          data: {
            cityId,
            ...act
          }
        });
      }
    }
  }

  // Seed sample users & community posts if needed
  console.log('Seeding community posts and users...');
  let demoUser = await prisma.user.findFirst({ where: { email: 'traveler@globetrotter.com' } });
  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        email: 'traveler@globetrotter.com',
        passwordHash: '$2b$10$EPVb/S.FmD9.N3zL5m7O2e.1/9GvX3J3b8k2K3L4M5N6O7P8Q9R0',
        name: 'Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'USER'
      }
    });
  }

  let demoUser2 = await prisma.user.findFirst({ where: { email: 'alex@globetrotter.com' } });
  if (!demoUser2) {
    demoUser2 = await prisma.user.create({
      data: {
        email: 'alex@globetrotter.com',
        passwordHash: '$2b$10$EPVb/S.FmD9.N3zL5m7O2e.1/9GvX3J3b8k2K3L4M5N6O7P8Q9R0',
        name: 'Alex Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        role: 'USER'
      }
    });
  }

  let demoUser3 = await prisma.user.findFirst({ where: { email: 'sophia@globetrotter.com' } });
  if (!demoUser3) {
    demoUser3 = await prisma.user.create({
      data: {
        email: 'sophia@globetrotter.com',
        passwordHash: '$2b$10$EPVb/S.FmD9.N3zL5m7O2e.1/9GvX3J3b8k2K3L4M5N6O7P8Q9R0',
        name: 'Sophia Martinez',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        role: 'USER'
      }
    });
  }

  const existingPosts = await prisma.communityPost.count();
  if (existingPosts === 0) {
    const post1 = await prisma.communityPost.create({
      data: {
        userId: demoUser.id,
        title: 'Unforgettable Sunset at Tokyo’s Sensō-ji Temple',
        destination: 'Tokyo, Japan',
        category: 'Trip Story',
        content: 'Exploring Asakusa in the early evening is magical. The incense smoke around the main hall, combined with illuminated lanterns and traditional stalls, creates an atmosphere you cannot find anywhere else in Tokyo. Highly recommend visiting around 5:30 PM!',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        likes: {
          create: [{ userId: demoUser2.id }, { userId: demoUser3.id }]
        },
        comments: {
          create: [
            { userId: demoUser2.id, content: 'Completely agree! The night lighting is stunning.' },
            { userId: demoUser3.id, content: 'Did you manage to try the melonpan bakery right outside the gate?' }
          ]
        }
      }
    });

    const post2 = await prisma.communityPost.create({
      data: {
        userId: demoUser2.id,
        title: 'Top 5 Hidden Gem Café Spots in Paris for Remote Travelers',
        destination: 'Paris, France',
        category: 'Travel Tip',
        content: 'If you need a quiet corner with strong espresso and reliable Wi-Fi in Paris: 1. KB Café Shop in Pigalle, 2. Ten Belles near Canal Saint-Martin, 3. The Broken Arm in Le Marais. Avoid overcrowded tourist spots near Notre-Dame!',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        likes: {
          create: [{ userId: demoUser.id }]
        },
        comments: {
          create: [
            { userId: demoUser.id, content: 'Ten Belles has the best sourdough sandwiches too!' }
          ]
        }
      }
    });

    const post3 = await prisma.communityPost.create({
      data: {
        userId: demoUser3.id,
        title: 'Chasing Waterfalls & Sunset Dancing in Uluwatu, Bali',
        destination: 'Bali, Indonesia',
        category: 'Destination Review',
        content: 'Watching the Kecak Fire Dance on the cliff edge of Uluwatu during sunset was an emotional experience. Tip: Buy your tickets online 2 hours before, and watch out for the cheeky monkeys near the temple entrance!',
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        likes: {
          create: [{ userId: demoUser.id }, { userId: demoUser2.id }]
        }
      }
    });

    console.log('Sample community posts successfully created!');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
