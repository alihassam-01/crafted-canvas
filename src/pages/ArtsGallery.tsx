import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, ShoppingBag, Heart, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { cartService } from '@/services/cart.service';
import { productService } from '@/services/product.service';
import { useAuth } from '@/hooks/use-auth';
import { Product } from '@/types';
import { cn } from '@/lib/utils';



const ArtCard = ({ product, index }: { product: Product, index: number }) => {
    // Mobile flip state
    const [isFlipped, setIsFlipped] = useState(false);
    const { isLoggedIn } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
        e.stopPropagation(); // Prevent flip/link click
        e.preventDefault();
        if (!isLoggedIn) {
            toast.error('Please sign in to add items to cart', {
                action: { label: 'Sign in', onClick: () => navigate('/auth?mode=login') },
            });
            return;
        }
        addToCartMutation.mutate({
            productId: product.id,
            quantity: 1,
            price: product.price,
            productName: product.name,
            productImage: product.images[0],
        });
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Only flip on small screens (less than lg breakpoint usually ~1024px)
        // We can use window.innerWidth check or rely on CSS classes.
        // However, JS logic is better for toggling state.
        if (window.innerWidth < 1024) {
            e.preventDefault(); // Prevent navigation
            setIsFlipped(!isFlipped);
        }
        // On Desktop, do nothing (Link will handle navigation)
    };

    return (
        <div
            className={cn(
                "group relative animate-fade-up break-inside-avoid mb-4 rounded-lg cursor-pointer perspective-1000",
            )}
            style={{ animationDelay: `${index * 0.1}s`, perspective: '1000px' }}
            onClick={handleCardClick}
        >
            <div
                className={cn(
                    "relative w-full transition-transform duration-700 transform-style-3d",
                    isFlipped ? "rotate-y-180" : ""
                )}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            >
                {/* Front Face */}
                <div className="relative backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    {/* We wrap image in Link only if we want desktop nav. 
              But mobile click prevents default. 
              So we can keep Link and onClick handles prevention.
          */}
                    <Link to={`/products/${product.id}`} className="block w-full" onClick={(e) => {
                        if (window.innerWidth < 1024) e.preventDefault();
                    }}>
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-auto object-cover transition-transform duration-700"
                        />
                        {/* Subtle Texture Overlay */}
                        <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-10 bg-[url('https://www.transparenttextures.com/patterns/canvas.png')]" />
                    </Link>

                    {/* Desktop Hover Overlay (Hidden on touch devices effectively by logic) */}
                    <div className="hidden lg:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-col justify-center items-center text-center p-6 text-white backdrop-blur-[2px]">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                            <h3 className="font-display text-2xl mb-2 tracking-wide text-white">
                                <Link to={`/products/${product.id}`}>{product.name}</Link>
                            </h3>
                            <p className="font-cursive text-lg text-white/80 mb-3 italic">
                                {product.tags[0]} • {new Date(product.createdAt).getFullYear()}
                            </p>
                            <p className="font-sans text-lg font-medium tracking-wider text-white border-b border-white/20 pb-1 inline-block mb-6">
                                ${product.price.toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                            <Button
                                size="icon"
                                className="rounded-full h-10 w-10 bg-white text-black hover:bg-white/90 hover:scale-110 transition-all duration-300"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full h-10 w-10 bg-transparent border border-white text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                            >
                                <Heart className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Flip Indicator */}
                    <div className="absolute bottom-2 right-2 lg:hidden bg-black/50 p-1.5 rounded-full text-white backdrop-blur-sm">
                        <RotateCw className="h-4 w-4" />
                    </div>
                </div>

                {/* Back Face (Mobile Only View) */}
                <div
                    className="absolute inset-0 top-0 left-0 w-full h-full bg-stone-900 backface-hidden flex flex-col justify-center items-center text-center p-6 text-white"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <h3 className="font-display text-2xl mb-2 tracking-wide text-white">
                        <Link to={`/products/${product.id}`}>{product.name}</Link>
                    </h3>
                    <p className="font-cursive text-lg text-white/80 mb-3 italic">
                        {product.tags[0]} • {new Date(product.createdAt).getFullYear()}
                    </p>
                    <p className="font-sans text-lg font-medium tracking-wider text-white border-b border-white/20 pb-1 inline-block mb-6">
                        ${product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3">
                        <Button
                            size="icon"
                            className="rounded-full h-10 w-10 bg-white text-black"
                            onClick={handleAddToCart}
                        >
                            <ShoppingBag className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full h-10 w-10 bg-transparent border border-white text-white"
                        >
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="link" className="mt-4 text-white hover:text-primary" onClick={() => navigate(`/products/${product.id}`)}>
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default function ArtsGallery() {
    const { data, isLoading } = useQuery({
        queryKey: ['products', 'arts-gallery'],
        queryFn: () => productService.listProducts({ limit: 100 }),
    });

    const artProducts = data?.data?.items.filter(p =>
        ['ART', 'PAINTING'].includes(p.category.toUpperCase())
    ) || [];

    return (
        <Layout>
            {/* Hero Section with Texture */}
            <div className="relative bg-[#fdfbf7] py-10 overflow-hidden texture-overlay">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-rose-100/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-teal-100/30 to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <span className="font-cursive text-3xl md:text-4xl text-primary mb-4 block animate-fade-up">
                        Curated Masterpieces
                    </span>
                    <h1 className="font-display text-5xl md:text-7xl mb-6 text-foreground tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        The Arts Gallery
                    </h1>

                    {/* Decorative Quote Section */}
                    <div className="max-w-3xl mx-auto mt-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <div className="w-24 h-1 bg-primary/20 mx-auto mb-8 rounded-full" />
                        <blockquote className="font-display italic text-2xl md:text-3xl text-stone-600 leading-relaxed mb-4">
                            "Art enables us to find ourselves and lose ourselves at the same time."
                        </blockquote>
                        <cite className="font-cursive text-xl text-primary not-italic block">
                            - Thomas Merton
                        </cite>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="container mx-auto px-4 py-16 bg-background">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : artProducts.length > 0 ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                        {artProducts.map((product, index) => (
                            <ArtCard key={product.id} product={product} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="font-cursive text-2xl text-muted-foreground">
                            Our gallery is currently being curated. Please check back soon.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
