import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { cartService } from '@/services/cart.service';
import { useAuth } from '@/hooks/use-auth';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // API returns images as string[], so we take the first one
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg';

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  const addToCartMutation = useMutation({
    mutationFn: cartService.addItem,
    onSuccess: () => {
      toast.success('Added to cart');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Failed to add to cart');
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!isLoggedIn) {
      toast.error('Please sign in to add items to cart', {
        action: {
          label: 'Sign in',
          onClick: () => navigate('/auth?mode=login'),
        },
      });
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
      price: product.price,
      productName: product.name,
      productImage: primaryImage,
    });
  };

  return (
    <div className={cn('group relative bg-white rounded-2xl sm:rounded-[2rem] p-2 sm:p-3 shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100', className)}>
      <Link to={`/products/${product.id}`} className="block relative z-10">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-[1.5rem] bg-gray-50">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          {/* Wishlist Button */}
          <button
            className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-charcoal-slate opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              // Add to wishlist logic
            }}
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount && (
              <Badge className="bg-berry-pink text-white border-none px-2 py-0.5 text-xs font-medium">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Add to Cart Button (Icon) */}
          <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-white/90 text-charcoal-slate hover:bg-charcoal-slate hover:text-white shadow-md border-none"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 px-1 pb-1">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-display text-lg text-charcoal-slate line-clamp-1 group-hover:text-berry-pink transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3.5 w-3.5 fill-berry-pink text-berry-pink" />
          <span className="text-sm font-medium text-charcoal-slate">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.totalReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-medium text-charcoal-slate">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

