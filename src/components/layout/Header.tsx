import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ShoppingBag, User, Menu, X, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth.service';
import { cartService } from '@/services/cart.service';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/products' },
  { name: 'Crochet', href: '/products?category=crochet' },
  { name: 'Arts/Painting', href: '/products?category=painting' },
  { name: 'Hand Crafts', href: '/products?category=handicraft' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  const isLoggedIn = !!userData?.data;

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: isLoggedIn,
    retry: false,
  });

  const cartItemCount = cartData?.data?.itemCount || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/20">
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/crevea-logo.png" alt="Crevea" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground/80 hover:text-primary transition-colors font-display text-lg italic"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search Icon (Expandable could be added later) */}
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => navigate('/products')}>
              <Search className="h-5 w-5 text-muted-foreground" />
            </Button>

            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 hidden sm:block text-muted-foreground hover:text-primary transition-colors">
              <Heart className="h-5 w-5" />
            </Link>

            {/* Messages */}
            {isLoggedIn && (
              <Link to="/dashboard/messages" className="p-2 relative hidden sm:block text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
              </Link>
            )}

            {/* Cart */}
            <Link to="/checkout" className="p-2 relative text-muted-foreground hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/messages">Messages</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/auth">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/auth?mode=register">Create Account</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden absolute top-full left-0 right-0 bg-background border-b shadow-medium transition-all duration-300 z-40',
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>

          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="py-3 px-3 rounded-lg hover:bg-muted transition-colors font-display text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
