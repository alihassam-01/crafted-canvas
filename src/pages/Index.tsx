import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Package, Shield } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { ShopCard } from '@/components/shops/ShopCard';
import { Button } from '@/components/ui/button';
import { mockProducts, mockShops, categories } from '@/data/mockData';

export default function Index() {
  const featuredProducts = mockProducts.filter(p => p.isFeatured).slice(0, 4);
  const featuredShops = mockShops.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium mb-6 animate-fade-up">
              <Sparkles className="h-4 w-4" />
              Discover Handmade Treasures
            </span>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-up stagger-1">
              Where <span className="text-primary">Creativity</span> Meets{' '}
              <span className="text-primary">Craftsmanship</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up stagger-2">
              Explore unique handmade creations from talented artisans. 
              From cozy crochet pieces to stunning original artwork.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up stagger-3">
              <Button size="xl" asChild>
                <Link to="/products">
                  Start Shopping
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/shops">Meet Our Artisans</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you're looking for in our curated collections
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-3xl aspect-[4/3] animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                  <h3 className="font-display text-2xl mb-1">{category.name}</h3>
                  <p className="text-background/80 text-sm mb-2">{category.description}</p>
                  <span className="text-sm font-medium">
                    {category.productCount} products →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl mb-4">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Handpicked treasures from our talented artisans
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/products">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

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

          <div className="mt-8 text-center sm:hidden">
            <Button asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Made with Love',
                description: 'Every item is crafted by skilled artisans who pour their heart into their work.',
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
                className="text-center p-8 rounded-3xl bg-card border animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-hero flex items-center justify-center">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-16 lg:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Meet Our Artisans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the creative minds behind the handmade magic
            </p>
          </div>

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

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/shops">
                Explore All Shops
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-warm p-8 md:p-12 lg:p-16 text-center text-primary-foreground">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Start Your Artisan Journey
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Are you a creator? Join our community of talented artisans and share your 
              handmade treasures with the world.
            </p>
            <Button size="xl" variant="hero" asChild>
              <Link to="/auth?mode=register&type=vendor">
                Open Your Shop
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            {/* Decorative circles */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-background/10 rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-background/10 rounded-full" />
          </div>
        </div>
      </section>
    </Layout>
  );
}
