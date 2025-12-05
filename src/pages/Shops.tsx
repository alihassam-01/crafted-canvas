import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { ShopCard } from '@/components/shops/ShopCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { shopService } from '@/services/shop.service';
import { ProductCategory, ShopFilters } from '@/types';
import { Loader2 } from 'lucide-react';

const categories: { id: ProductCategory; name: string }[] = [
  { id: 'CROCHET', name: 'Crochet' },
  { id: 'ART', name: 'Art' },
  { id: 'PAINTING', name: 'Painting' },
  { id: 'HANDCRAFT', name: 'Handcraft' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Sales' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function Shops() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ProductCategory | null;

  const [filters, setFilters] = useState<ShopFilters>({
    category: categoryParam || undefined,
    isVerified: false,
    sortBy: 'popular',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['shops', filters.category],
    queryFn: () => shopService.listShops({
      category: filters.category,
      limit: 100, // Fetch more to allow client-side filtering/sorting for now
    }),
  });

  const filteredShops = useMemo(() => {
    if (!data?.data?.items) return [];
    let result = [...data.data.items];

    if (filters.isVerified) {
      result = result.filter(s => s.verificationStatus === 'VERIFIED');
    }

    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.totalSales - a.totalSales);
    }

    return result;
  }, [data, filters]);

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-hero py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4">
            Meet Our Artisans
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover talented creators from around the world. Each shop tells a unique story
            of passion, creativity, and craftsmanship.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-card rounded-xl border">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) =>
                setFilters(f => ({
                  ...f,
                  category: value === 'all' ? undefined : value as ProductCategory,
                }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Verified Filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.isVerified}
                onCheckedChange={(checked) =>
                  setFilters(f => ({ ...f, isVerified: !!checked }))
                }
              />
              <span className="text-sm">Verified Only</span>
            </label>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {filteredShops.length} shops
            </span>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                setFilters(f => ({ ...f, sortBy: value as ShopFilters['sortBy'] }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Shops Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            Failed to load shops. Please try again later.
          </div>
        ) : filteredShops.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop, index) => (
              <div
                key={shop.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ShopCard shop={shop} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No shops found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

