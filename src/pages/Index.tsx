import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Loader2 } from 'lucide-react';
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
    queryFn: () => productService.listProducts({ limit: 3, sortBy: 'popular' }),
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

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-canvas-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="font-cursive text-3xl text-muted-foreground block mb-3 transform -rotate-2">Handpicked for you</span>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal-slate drop-shadow-sm">
              Featured Products
            </h2>
          </div>

          {isProductsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 lg:py-28 bg-canvas-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="font-cursive text-3xl text-muted-foreground block mb-3 transform -rotate-2">Explore our collections</span>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal-slate drop-shadow-sm">
              Browse by Category
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
            {/* Crochet Category - Card 1 */}
            {/* Crochet Category - Card 1 */}
            <Link to="/products?category=crochet" className="group relative w-72 h-72 md:w-80 md:h-80 transition-transform duration-300 hover:scale-105">
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <img
                  src="/crochet-f.png"
                  alt="Crochet Creations"
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 w-64 h-24">
                    <img src="/text-bg.svg" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                    <span className="relative font-cursive text-2xl text-charcoal-slate pt-1 z-10">Crochet Creations</span>
                  </div>
                </div> */}
              </div>
            </Link>

            {/* Art & Painting Category - Card 2 */}
            <Link to="/products?category=painting" className="group relative w-72 h-72 md:w-80 md:h-80 transition-transform duration-300 hover:scale-105 mt-8 md:mt-0">
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <img
                  src="/painting-f.png"
                  alt="Painting"
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center transform rotate-1 group-hover:rotate-0 transition-transform duration-300 w-64 h-18">
                    <img src="/text-bg.svg" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                    <span className="relative font-cursive text-2xl text-charcoal-slate pt-1 z-10">Painting</span>
                  </div>
                </div> */}
              </div>
            </Link>

            {/* Hand Crafts Category - Card 3 */}
            <Link to="/products?category=handicraft" className="group relative w-72 h-72 md:w-80 md:h-80 transition-transform duration-300 hover:scale-105 mt-8 md:mt-0">
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <img
                  src="/handcraft-f.png"
                  alt="Hand Crafts"
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center transform -rotate-1 group-hover:rotate-0 transition-transform duration-300 w-64 h-24">
                    <img src="/text-bg.svg" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                    <span className="relative font-cursive text-2xl text-charcoal-slate pt-1 z-10">Hand Crafts</span>
                  </div>
                </div> */}
              </div>
            </Link>
          </div>

          <div className="mt-16 text-center">
            <Link to="/products" className="inline-block">
              <button className="btn-hand-drawn">
                View All
              </button>
            </Link>
          </div>
        </div>
      </section>



      {/* Cravators of the Week */}
      <section className="py-16 lg:py-24 bg-canvas-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="font-cursive text-3xl text-muted-foreground block mb-3 transform -rotate-2">Meet our talented artists</span>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal-slate drop-shadow-sm">
              Cravators of the Week
            </h2>
          </div>

          {isShopsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <Link to="/shops">
                View All Shops
                <ArrowRight className="ml-2 h-4 w-4" />
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
