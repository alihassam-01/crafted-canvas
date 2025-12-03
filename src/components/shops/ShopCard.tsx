import { Link } from 'react-router-dom';
import { Star, MapPin, Package, Users, BadgeCheck } from 'lucide-react';
import { Shop } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShopCardProps {
  shop: Shop;
  className?: string;
  variant?: 'default' | 'compact';
}

export function ShopCard({ shop, className, variant = 'default' }: ShopCardProps) {
  if (variant === 'compact') {
    return (
      <Link 
        to={`/shops/${shop.slug}`}
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl bg-card border hover:shadow-soft transition-all duration-300',
          className
        )}
      >
        <img
          src={shop.logo}
          alt={shop.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{shop.name}</h3>
            {shop.isVerified && (
              <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {shop.rating}
            </span>
            <span>{shop.productCount} items</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className={cn('group card-hover', className)}>
      <Link to={`/shops/${shop.slug}`} className="block">
        {/* Banner */}
        <div className="relative h-32 rounded-t-2xl overflow-hidden bg-muted">
          {shop.banner ? (
            <img
              src={shop.banner}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-hero" />
          )}
          
          {/* Category Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 capitalize"
          >
            {shop.category}
          </Badge>
        </div>

        {/* Logo */}
        <div className="relative px-4">
          <div className="absolute -top-8 left-4">
            <img
              src={shop.logo}
              alt={shop.name}
              className="w-16 h-16 rounded-full border-4 border-background object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-10 pb-4 px-4 bg-card rounded-b-2xl border border-t-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{shop.name}</h3>
              {shop.isVerified && (
                <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {shop.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium text-foreground">{shop.rating}</span>
              <span>({shop.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>{shop.productCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{shop.followers}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{shop.location}</span>
          </div>
        </div>
      </Link>

      {/* Follow Button */}
      <div className="px-4 pb-4 bg-card rounded-b-2xl -mt-2">
        <Button variant="outline" className="w-full" onClick={(e) => e.preventDefault()}>
          Follow Shop
        </Button>
      </div>
    </div>
  );
}
