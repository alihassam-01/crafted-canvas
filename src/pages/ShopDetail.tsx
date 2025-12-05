import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Star, MapPin, Package, Users, BadgeCheck,
  MessageCircle, Share2, Calendar, Loader2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { shopService } from '@/services/shop.service';
import { productService } from '@/services/product.service';
import { reviewService } from '@/services/review.service';
import { cn } from '@/lib/utils';

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: shopData, isLoading: isShopLoading } = useQuery({
    queryKey: ['shop', id],
    queryFn: () => shopService.getShop(id!),
    enabled: !!id,
  });

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['shop-products', id],
    queryFn: () => productService.getShopProducts(id!, { limit: 20 }),
    enabled: !!id,
  });

  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['shop-reviews', id],
    queryFn: () => reviewService.getReviews(id!, { limit: 20 }),
    enabled: !!id,
  });

  const shop = shopData?.data;
  const products = productsData?.data?.items || [];
  const reviews = reviewsData?.data?.items || [];

  if (isShopLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!shop) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Shop not found</h1>
          <Button asChild>
            <Link to="/shops">Browse Shops</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isVerified = shop.verificationStatus === 'VERIFIED';
  const location = shop.address ? `${shop.address.city}, ${shop.address.country}` : 'Unknown Location';

  return (
    <Layout>
      {/* Banner */}
      <div className="relative h-48 md:h-64 lg:h-80 bg-muted overflow-hidden">
        {shop.banner ? (
          <img
            src={shop.banner}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-hero" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Shop Info */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Logo */}
            <img
              src={shop.logo || '/placeholder-shop.jpg'}
              alt={shop.name}
              className="w-32 h-32 rounded-2xl border-4 border-background object-cover shadow-medium"
            />

            {/* Info */}
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display text-3xl md:text-4xl">{shop.name}</h1>
                {isVerified && (
                  <BadgeCheck className="h-6 w-6 text-primary" />
                )}
                <Badge variant="secondary" className="capitalize">
                  {shop.category}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium text-foreground">{shop.rating}</span>
                  <span>({shop.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{shop.totalProducts} products</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{shop.totalSales} Sales</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Since {new Date(shop.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-2">
              <Button
                variant={isFollowing ? 'secondary' : 'default'}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="mb-12">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="products"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Products ({products.length})
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Reviews ({shop.totalReviews})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-8">
            {isProductsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
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
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl mb-4">About {shop.name}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {shop.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h3 className="font-medium mb-2">Location</h3>
                  <p className="text-muted-foreground">{location}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h3 className="font-medium mb-2">Contact</h3>
                  <p className="text-muted-foreground">{shop.contactEmail}</p>
                  <p className="text-muted-foreground">{shop.contactPhone}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            {isReviewsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="p-6 bg-card rounded-xl border">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.user?.avatar || '/placeholder-avatar.jpg'}
                        alt={review.user?.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {review.user?.firstName} {review.user?.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-4 w-4',
                                i < review.rating
                                  ? 'fill-primary text-primary'
                                  : 'text-muted'
                              )}
                            />
                          ))}
                        </div>
                        <h4 className="font-medium mb-1">{review.title}</h4>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No reviews yet</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

