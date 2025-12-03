import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, Heart, ShoppingBag, Minus, Plus, Truck, Shield, 
  RefreshCw, ChevronRight, Check, BadgeCheck, MessageCircle 
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockProducts, mockProductReviews } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = mockProducts.find(p => p.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const currentPrice = selectedSize
    ? product.sizes?.find(s => s.name === selectedSize)?.price || product.price
    : product.price;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/products" className="hover:text-primary">Products</Link>
            <ChevronRight className="h-4 w-4" />
            <Link 
              to={`/products?category=${product.category}`} 
              className="hover:text-primary capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.alt || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground/30'
                    )}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Shop Link */}
            <Link 
              to={`/shops/${product.shop.slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <img
                src={product.shop.logo}
                alt={product.shop.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              {product.shop.name}
              {product.shop.isVerified && (
                <BadgeCheck className="h-4 w-4 text-primary" />
              )}
            </Link>

            <div>
              <h1 className="font-display text-3xl md:text-4xl mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted'
                      )}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">${currentPrice.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
                {product.compareAtPrice && (
                  <Badge variant="default">
                    Save {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-muted-foreground">{product.shortDescription}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map(size => (
                      <SelectItem key={size.id} value={size.name}>
                        {size.name} - ${size.price.toFixed(2)}
                        {size.stock < 5 && (
                          <span className="text-destructive ml-2">
                            Only {size.stock} left
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Color: {selectedColor || 'Select'}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm transition-all',
                        selectedColor === color
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-muted-foreground/50'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 gap-2">
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Contact Seller */}
            <Button variant="secondary" className="w-full gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Seller
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              {[
                { icon: Truck, label: 'Free shipping over $75' },
                { icon: Shield, label: 'Buyer protection' },
                { icon: RefreshCw, label: '30-day returns' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <item.icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Processing Time */}
            <div className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-sage-dark" />
                <span>
                  <strong>Processing time:</strong> {product.processingTime}
                </span>
              </div>
              {product.materials && (
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Check className="h-4 w-4 text-sage-dark" />
                  <span>
                    <strong>Materials:</strong> {product.materials.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Description
            </TabsTrigger>
            {product.sizeChart && (
              <TabsTrigger 
                value="size-chart"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Size Chart
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Reviews ({product.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p>{product.description}</p>
              {product.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-4 not-prose">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {product.sizeChart && (
            <TabsContent value="size-chart" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    {product.sizeChart[0].width && <TableHead>Width</TableHead>}
                    {product.sizeChart[0].length && <TableHead>Length</TableHead>}
                    {product.sizeChart[0].bust && <TableHead>Bust</TableHead>}
                    {product.sizeChart[0].waist && <TableHead>Waist</TableHead>}
                    {product.sizeChart[0].hips && <TableHead>Hips</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.sizeChart.map((row) => (
                    <TableRow key={row.size}>
                      <TableCell className="font-medium">{row.size}</TableCell>
                      {row.width && <TableCell>{row.width}</TableCell>}
                      {row.length && <TableCell>{row.length}</TableCell>}
                      {row.bust && <TableCell>{row.bust}</TableCell>}
                      {row.waist && <TableCell>{row.waist}</TableCell>}
                      {row.hips && <TableCell>{row.hips}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          )}

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {mockProductReviews.map(review => (
                <div key={review.id} className="p-6 bg-card rounded-xl border">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.user.avatar}
                      alt={review.user.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">
                            {review.user.firstName} {review.user.lastName}
                          </span>
                          {review.verified && (
                            <Badge variant="success" className="ml-2">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
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
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl mb-6">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
