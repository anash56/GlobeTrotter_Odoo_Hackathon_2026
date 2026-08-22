const API_BASE_URL = 'http://localhost:5000/api/cities';

export const cityService = {
  /**
   * Fetch cities with search, filter by region/costIndex, and sorting
   */
  async getCities(params = {}) {
    const { search = '', region = '', sortBy = '', costIndex = '' } = params;
    const query = new URLSearchParams();

    if (search) query.append('search', search);
    if (region && region !== 'All') query.append('region', region);
    if (sortBy && sortBy !== 'default') query.append('sortBy', sortBy);
    if (costIndex && costIndex !== 'All') query.append('costIndex', costIndex);

    try {
      const response = await fetch(`${API_BASE_URL}?${query.toString()}`);
      if (response.ok) {
        const data = await response.json();
        return data.cities || [];
      }
    } catch (err) {
      console.warn('Backend unavailable, engaging client search fallback:', err.message);
    }

    // Client fallback dataset for seamless offline operation
    const fallbackCities = [
      {
        id: 'city_tokyo',
        name: 'Tokyo',
        country: 'Japan',
        region: 'Asia',
        description: 'Neon-lit skyscrapers, historic temples, and world-class culinary experiences.',
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
        costIndex: 'Moderate',
        avgDailyCost: 150.0,
        popularityScore: 4.9,
      },
      {
        id: 'city_paris',
        name: 'Paris',
        country: 'France',
        region: 'Europe',
        description: 'The romantic capital of art, fashion, gastronomy, and iconic architecture.',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        costIndex: 'Luxury',
        avgDailyCost: 220.0,
        popularityScore: 4.8,
      },
      {
        id: 'city_dubai',
        name: 'Dubai',
        country: 'United Arab Emirates',
        region: 'Middle East',
        description: 'Futuristic skyline, desert safaris, luxury shopping, and golden beaches.',
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        costIndex: 'Luxury',
        avgDailyCost: 250.0,
        popularityScore: 4.7,
      },
      {
        id: 'city_newyork',
        name: 'New York',
        country: 'United States',
        region: 'North America',
        description: 'Bustling metropolis with Broadway, Central Park, and endless culture.',
        imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        costIndex: 'Luxury',
        avgDailyCost: 210.0,
        popularityScore: 4.9,
      },
      {
        id: 'city_bali',
        name: 'Bali',
        country: 'Indonesia',
        region: 'South Asia',
        description: 'Tropical paradise of volcanic mountains, iconic rice paddies, and coral reefs.',
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        costIndex: 'Budget',
        avgDailyCost: 75.0,
        popularityScore: 4.85,
      },
      {
        id: 'city_rome',
        name: 'Rome',
        country: 'Italy',
        region: 'Europe',
        description: 'Ancient ruins, vibrant piazzas, rich history, and famous Italian dining.',
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        costIndex: 'Moderate',
        avgDailyCost: 140.0,
        popularityScore: 4.75,
      },
    ];

    let result = [...fallbackCities];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (region && region !== 'All') {
      result = result.filter((c) => c.region.toLowerCase() === region.toLowerCase());
    }

    if (costIndex && costIndex !== 'All') {
      result = result.filter((c) => c.costIndex.toLowerCase() === costIndex.toLowerCase());
    }

    if (sortBy === 'popularity') {
      result.sort((a, b) => b.popularityScore - a.popularityScore);
    } else if (sortBy === 'cost-asc') {
      result.sort((a, b) => a.avgDailyCost - b.avgDailyCost);
    } else if (sortBy === 'cost-desc') {
      result.sort((a, b) => b.avgDailyCost - a.avgDailyCost);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  },
};
