import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, SlidersHorizontal, Grid, LayoutGrid, X, Loader2 } from 'lucide-react';
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
import { productService } from '@/services/product.service';
import { ProductCategory, ProductFilters } from '@/types';

const categories: { id: ProductCategory; name: string }[] = [
  { id: 'CROCHET', name: 'Crochet' },
  { id: 'ART', name: 'Art' },
  { id: 'PAINTING', name: 'Painting' },
  { id: 'HANDCRAFT', name: 'Handcraft' },
];

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
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Parse initial categories from URL
  const categoryParams = searchParams.getAll('category');
  const initialCategories = categoryParams
    .map(param => categories.find(c => c.id.toLowerCase() === param.toLowerCase())?.id)
    .filter((c): c is ProductCategory => !!c);

  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategories.length > 0 ? initialCategories : undefined,
    sortBy: sortParam as ProductFilters['sortBy'],
    inStock: false, // Default to showing all products
    isHandmade: false,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchParam, priceRange, filters.sortBy],
    queryFn: () => productService.listProducts({
      search: searchParam,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      limit: 100,
    }),
  });

  const filteredProducts = useMemo(() => {
    if (!data?.data?.items) return [];
    let result = [...data.data.items];

    // Category filter (Client side - Case Insensitive, Multiple)
    if (filters.category && Array.isArray(filters.category) && filters.category.length > 0) {
      const selectedCategories = filters.category.map(c => c.toLowerCase());
      result = result.filter(p => selectedCategories.includes(p.category.toLowerCase()));
    }

    // In stock filter (Client side)
    if (filters.inStock) {
      result = result.filter(p => (p.stock || 0) > 0);
    }

    // Handmade filter (Client side)
    if (filters.isHandmade) {
      result = result.filter(p => p.tags?.includes('handmade'));
    }

    // Sorting (Client side if API doesn't support all)
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
        result.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [data, filters]);

  console.log('Displayed products:', filteredProducts);

  const activeFiltersCount = [
    filters.category && (filters.category as ProductCategory[]).length > 0,
    filters.isHandmade,
    priceRange[0] > 0 || priceRange[1] < 10000,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      sortBy: 'newest',
      inStock: false,
      category: [],
    });
    setPriceRange([0, 10000]);
    setSearchParams({});
  };

  const toggleCategory = (categoryId: ProductCategory) => {
    setFilters(prev => {
      const currentCategories = (prev.category as ProductCategory[]) || [];
      const isSelected = currentCategories.includes(categoryId);

      let newCategories;
      if (isSelected) {
        newCategories = currentCategories.filter(c => c !== categoryId);
      } else {
        newCategories = [...currentCategories, categoryId];
      }

      return {
        ...prev,
        category: newCategories.length > 0 ? newCategories : undefined
      };
    });
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
                checked={(filters.category as ProductCategory[] || []).includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={10000}
            // step={1}
            className="mb-3"
          />
        </div>
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
            {searchParam ? `Search: "${searchParam}"` : 'All Products'}
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
                {filters.category && Array.isArray(filters.category) && filters.category.map(catId => (
                  <Badge key={catId} variant="secondary" className="gap-1">
                    {categories.find(c => c.id === catId)?.name}
                    <button onClick={() => toggleCategory(catId)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
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
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                Failed to load products. Please try again later.
              </div>
            ) : filteredProducts.length > 0 ? (
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
