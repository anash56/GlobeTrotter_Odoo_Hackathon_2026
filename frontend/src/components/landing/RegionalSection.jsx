import React from 'react';
import { RegionCard } from './RegionCard';
import { Compass } from 'lucide-react';

export function RegionalSection({ onSelectRegion }) {
  const regions = [
    {
      id: 'asia',
      name: 'Asia',
      count: 14,
      description: 'Ancient heritage, neon lights, and sublime tropical beaches.',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'europe',
      name: 'Europe',
      count: 22,
      description: 'Historic cobblestones, majestic castles, and iconic culture.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'middle-east',
      name: 'Middle East',
      count: 8,
      description: 'Futuristic architecture, timeless deserts, and rich traditions.',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'north-america',
      name: 'North America',
      count: 18,
      description: 'Vast national parks, iconic skylines, and diverse landscapes.',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'south-asia',
      name: 'South Asia',
      count: 11,
      description: 'Vibrant colors, serene islands, and tropical wildlife.',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="regional-section" id="destinations">
      <div className="section-header">
        <div>
          <div className="section-subtitle">
            <Compass size={14} /> Discovery Hub
          </div>
          <h2 className="section-title">Explore Top Destinations</h2>
        </div>
        <p className="section-desc">
          Handpicked world regions offering unforgettable adventures and curated travel experiences.
        </p>
      </div>

      <div className="regional-grid">
        {regions.map((region) => (
          <RegionCard key={region.id} region={region} onClick={onSelectRegion} />
        ))}
      </div>
    </section>
  );
}
