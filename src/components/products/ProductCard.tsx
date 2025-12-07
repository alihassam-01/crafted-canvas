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
    <div className={cn('group relative', className)}>
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />

          {/* Wishlist Button */}
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:scale-110"
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
              <Badge className="bg-primary text-primary-foreground">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button
              className="w-full gap-2"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
              Quick Add
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <Link
          to={`/shops/${product?.shop?.id}`}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {product?.shop?.name}
        </Link>

        <Link to={`/products/${product.slug}`}>
          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.totalReviews})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

