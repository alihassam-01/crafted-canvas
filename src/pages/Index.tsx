import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Sparkles, Heart, Package, Shield, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { ShopCard } from '@/components/shops/ShopCard';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/mockData';
import { productService } from '@/services/product.service';
import { shopService } from '@/services/shop.service';

export default function Index() {
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.listProducts({ limit: 4, sortBy: 'popular' }),
  });

  const { data: shopsData, isLoading: isShopsLoading } = useQuery({
    queryKey: ['featured-shops'],
    queryFn: () => shopService.listShops({ limit: 3, sortBy: 'popular' }),
  });

  const featuredProducts = productsData?.data?.items || [];
  const featuredShops = shopsData?.data?.items || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-canvas-cream">
        {/* Watercolor Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/crevea-bg.png"
            alt="Watercolor Background"
            className="w-full h-full object-cover object-center opacity-90"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative container mx-auto px-4 py-32 lg:py-48 flex flex-col items-center justify-center text-center z-10">
          <div className="max-w-4xl mx-auto animate-fade-up">
            {/* Logo/Icon above text if needed, or just text */}

            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mb-4 text-white drop-shadow-md">
              Crevea
            </h1>

            <p className="font-sans text-lg md:text-xl lg:text-2xl text-white/90 mb-10 font-light tracking-wide drop-shadow-sm">
              Curated Crochet, Fine Arts & Exquisite Hand Crafts
            </p>

            <Button size="xl" className="bg-soft-beige text-charcoal-slate hover:bg-white border-none shadow-lg px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105" asChild>
              <Link to="/products">
                Explore Collection
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 lg:py-28 bg-canvas-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Crochet Category */}
            <div className="flex flex-col items-center group">
              <div className="relative mb-8 w-full flex justify-center">
                {/* Brush Stroke Background for Title */}
                <div className="absolute inset-0 bg-berry-pink/80 transform -skew-x-12 scale-110 rounded-sm blur-[1px] opacity-90"></div>
                <h3 className="relative z-10 font-display text-2xl text-white px-6 py-2 italic tracking-wide">
                  Crochet Creations
                </h3>
              </div>
              <Link to="/products?category=crochet" className="w-full aspect-square overflow-hidden rounded-3xl shadow-soft hover:shadow-xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1584992236310-6eddd724a4c7?auto=format&fit=crop&q=80&w=800"
                  alt="Crochet Creations"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </Link>
              <Button variant="ghost" className="mt-4 text-berry-pink hover:text-berry-pink/80 hover:bg-berry-pink/10" asChild>
                <Link to="/products?category=crochet">View All</Link>
              </Button>
            </div>

            {/* Art & Painting Category */}
            <div className="flex flex-col items-center group mt-12 md:mt-0">
              <div className="relative mb-8 w-full flex justify-center">
                {/* Brush Stroke Background for Title */}
                <div className="absolute inset-0 bg-royal-lavender/80 transform skew-x-12 scale-110 rounded-sm blur-[1px] opacity-90"></div>
                <h3 className="relative z-10 font-display text-2xl text-white px-6 py-2 italic tracking-wide">
                  Art & Painting Gallery
                </h3>
              </div>
              <Link to="/products?category=painting" className="w-full aspect-square overflow-hidden rounded-3xl shadow-soft hover:shadow-xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800"
                  alt="Art & Painting"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </Link>
              <Button variant="ghost" className="mt-4 text-royal-lavender hover:text-royal-lavender/80 hover:bg-royal-lavender/10" asChild>
                <Link to="/products?category=painting">View All</Link>
              </Button>
            </div>

            {/* Hand Crafts Category */}
            <div className="flex flex-col items-center group mt-12 md:mt-0">
              <div className="relative mb-8 w-full flex justify-center">
                {/* Brush Stroke Background for Title */}
                <div className="absolute inset-0 bg-teal-blue/80 transform -skew-x-6 scale-110 rounded-sm blur-[1px] opacity-90"></div>
                <h3 className="relative z-10 font-display text-2xl text-white px-6 py-2 italic tracking-wide">
                  Unique Hand Crafts
                </h3>
              </div>
              <Link to="/products?category=handicraft" className="w-full aspect-square overflow-hidden rounded-3xl shadow-soft hover:shadow-xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1605218427368-35b019b8a391?auto=format&fit=crop&q=80&w=800"
                  alt="Hand Crafts"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </Link>
              <Button variant="ghost" className="mt-4 text-teal-blue hover:text-teal-blue/80 hover:bg-teal-blue/10" asChild>
                <Link to="/products?category=handicraft">View All</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl mb-4 text-charcoal-slate">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Handpicked treasures from our talented crevators
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex text-charcoal-slate">
              <Link to="/products">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isProductsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 lg:py-24 bg-canvas-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Made with Love',
                description: 'Every item is crafted by skilled crevators who pour their heart into their work.',
              },
              {
                icon: Package,
                title: 'Secure Packaging',
                description: 'Your treasures are carefully packaged to arrive safely at your doorstep.',
              },
              {
                icon: Shield,
                title: 'Buyer Protection',
                description: 'Shop with confidence knowing your purchase is protected.',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="text-center p-8 rounded-3xl bg-white/80 border border-border/50 shadow-sm animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-soft-beige flex items-center justify-center text-charcoal-slate">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl mb-3 text-charcoal-slate">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Background Wash */}
        <div className="absolute inset-0 bg-gradient-hero opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4 text-charcoal-slate">
              Meet Our Crevators
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the creative minds behind the handmade magic
            </p>
          </div>

          {isShopsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredShops.map((shop, index) => (
                <div
                  key={shop.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ShopCard shop={shop} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="bg-white/80 border-charcoal-slate/20 hover:bg-white" asChild>
              <Link to="/shops">
                Explore All Shops
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-canvas-cream">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-charcoal-slate p-8 md:p-12 lg:p-16 text-center text-white">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Become A Crevator
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Are you a creator? Join our community of talented crevators and share your
              handmade treasures with the world.
            </p>
            <Button size="xl" className="bg-berry-pink hover:bg-berry-pink/90 text-white border-none" asChild>
              <Link to="/auth?mode=register&type=vendor">
                Open Your Shop
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            {/* Decorative circles */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/5 rounded-full" />
          </div>
        </div>
      </section>
    </Layout>
  );
}
