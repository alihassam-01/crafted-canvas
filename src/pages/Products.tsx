import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid, LayoutGrid, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { mockProducts, categories } from '@/data/mockData';
import { ProductCategory, ProductFilters } from '@/types';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);

  const categoryParam = searchParams.get('category') as ProductCategory | null;
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  const [filters, setFilters] = useState<ProductFilters>({
    category: categoryParam || undefined,
    sortBy: sortParam as ProductFilters['sortBy'],
    inStock: true,
    isHandmade: false,
  });

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Search filter
    if (searchParam) {
      const search = searchParam.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags.some(t => t.toLowerCase().includes(search))
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // In stock filter
    if (filters.inStock) {
      result = result.filter(p => p.stock > 0);
    }

    // Handmade filter
    if (filters.isHandmade) {
      result = result.filter(p => p.isHandmade);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [searchParam, filters, priceRange]);

  const activeFiltersCount = [
    filters.category,
    filters.isHandmade,
    priceRange[0] > 0 || priceRange[1] < 500,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      sortBy: 'newest',
      inStock: true,
    });
    setPriceRange([0, 500]);
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-semibold mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <label
              key={cat.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={filters.category === cat.id}
                onCheckedChange={(checked) =>
                  setFilters(f => ({
                    ...f,
                    category: checked ? cat.id as ProductCategory : undefined,
                  }))
                }
              />
              <span className="text-sm">{cat.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                ({cat.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={500}
          step={10}
          className="mb-3"
        />
        <div className="flex items-center gap-2 text-sm">
          <Input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className="w-20 h-8"
          />
          <span>to</span>
          <Input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="w-20 h-8"
          />
        </div>
      </div>

      {/* Other Filters */}
      <div>
        <h4 className="font-semibold mb-3">Other Filters</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={filters.inStock}
              onCheckedChange={(checked) =>
                setFilters(f => ({ ...f, inStock: !!checked }))
              }
            />
            <span className="text-sm">In Stock Only</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={filters.isHandmade}
              onCheckedChange={(checked) =>
                setFilters(f => ({ ...f, isHandmade: !!checked }))
              }
            />
            <span className="text-sm">Handmade Only</span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl mb-2">
            {categoryParam
              ? categories.find(c => c.id === categoryParam)?.name || 'Products'
              : searchParam
              ? `Search: "${searchParam}"`
              : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} products found
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount} active</Badge>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-1">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Active Filters */}
              <div className="hidden lg:flex items-center gap-2 flex-wrap flex-1">
                {filters.category && (
                  <Badge variant="secondary" className="gap-1">
                    {categories.find(c => c.id === filters.category)?.name}
                    <button onClick={() => setFilters(f => ({ ...f, category: undefined }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>

              {/* Sort */}
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters(f => ({ ...f, sortBy: value as ProductFilters['sortBy'] }))
                }
              >
                <SelectTrigger className="w-44">
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

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
