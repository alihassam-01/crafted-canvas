import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { cartService } from '@/services/cart.service';

export default function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [promoCode, setPromoCode] = useState('');

  // Fetch cart data
  const { data: cartData, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    retry: false,
  });

  // Update cart item quantity
  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Failed to update cart');
    },
  });

  // Remove cart item
  const removeItemMutation = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: () => {
      toast.success('Item removed from cart');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Failed to remove item');
    },
  });

  const cart = cartData?.data;
  const cartItems = cart?.items || [];

  // Calculate subtotal from individual items
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !cart) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="font-display text-3xl mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items yet.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="font-display text-3xl mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items yet.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  console.log("cart items: ", cartItems)
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="font-display text-3xl md:text-4xl mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 bg-card rounded-xl border"
              >
                <Link to={`/products/${item.productId}`}>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        Rs. {item.price.toFixed(2)} each
                      </p>
                    </div>
                    <button
                      onClick={() => removeItemMutation.mutate(item.productId)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      disabled={removeItemMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateItemMutation.mutate({ itemId: item.productId, quantity: Math.max(1, item.quantity - 1) })}
                        disabled={updateItemMutation.isPending || item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateItemMutation.mutate({ itemId: item.productId, quantity: item.quantity + 1 })}
                        disabled={updateItemMutation.isPending}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-semibold">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl border p-6">
              <h2 className="font-display text-xl mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline">Apply</Button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={cn(shipping === 0 && 'text-sage-dark')}>
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-muted-foreground mt-4">
                  Add Rs.{(75 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => navigate('/payment')}
              >
                Proceed to Payment
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
