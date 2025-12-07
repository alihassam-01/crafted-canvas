import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, Lock, Check, ChevronRight,
  MapPin, Truck, Loader2, ShoppingBag, Banknote
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { cartService } from '@/services/cart.service';
import { orderService } from '@/services/order.service';
import type { Address, PaymentMethod } from '@/types/api';

export default function Payment() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');

  // Form state
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  const [saveAddress, setSaveAddress] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Fetch cart data
  const { data: cartData, isLoading: isLoadingCart } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    retry: false,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (response) => {
      toast.success('Order placed successfully!');
      navigate(`/dashboard/orders`);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create order');
    },
  });

  const cart = cartData?.data;
  const cartItems = cart?.items || [];

  // Calculate totals from cart
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : (shippingMethod === 'express' ? 19.99 : 9.99);
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('review');
    } else {
      // Create order
      createOrderMutation.mutate({
        shippingAddress,
        paymentMethod,
      });
    }
  };

  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ];

  // Loading state
  if (isLoadingCart) {
    return (
      <Layout showFooter={false}>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Empty cart state
  if (!cart || cartItems.length === 0) {
    return (
      <Layout showFooter={false}>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="font-display text-3xl mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/checkout"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                  step === s.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : steps.findIndex(st => st.id === step) > index
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted text-muted-foreground'
                )}
              >
                {steps.findIndex(st => st.id === step) > index ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'ml-2 text-sm font-medium',
                  step === s.id ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {s.label}
              </span>
              {index < steps.length - 1 && (
                <ChevronRight className="mx-4 h-5 w-5 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Shipping Step */}
              {step === 'shipping' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl">Shipping Address</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={shippingAddress.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={shippingAddress.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={shippingAddress.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="apartment"
                      value={shippingAddress.apartment}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={shippingAddress.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="saveAddress"
                      checked={saveAddress}
                      onCheckedChange={(checked) => setSaveAddress(checked === true)}
                    />
                    <label htmlFor="saveAddress" className="text-sm">
                      Save this address for future orders
                    </label>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-xl">Shipping Method</h3>
                  </div>

                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <div>
                          <Label htmlFor="standard" className="font-medium">
                            Standard Shipping
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            5-7 business days
                          </p>
                        </div>
                      </div>
                      <span className={cn(subtotal > 75 && shippingMethod === 'standard' && 'text-sage-dark font-medium')}>
                        {subtotal > 75 && shippingMethod === 'standard' ? 'FREE' : `Rs. ${(9.99).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg mt-3">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" id="express" />
                        <div>
                          <Label htmlFor="express" className="font-medium">
                            Express Shipping
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            2-3 business days
                          </p>
                        </div>
                      </div>
                      <span>Rs. 19.99</span>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl">Payment Method</h2>
                  </div>

                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                    <div className={cn(
                      'p-4 border rounded-lg transition-colors',
                      paymentMethod === 'CARD' && 'border-primary'
                    )}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="CARD" id="card" />
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="card" className="font-medium">
                          Credit / Debit Card
                        </Label>
                      </div>

                      {paymentMethod === 'CARD' && (
                        <div className="mt-4 space-y-4 pl-6">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvc">CVC</Label>
                              <Input id="cvc" placeholder="123" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input id="cardName" required />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={cn(
                      'p-4 border rounded-lg mt-3 transition-colors',
                      paymentMethod === 'CASH_ON_DELIVERY' && 'border-primary'
                    )}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="CASH_ON_DELIVERY" id="cod" />
                        <Banknote className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label htmlFor="cod" className="font-medium">
                            Cash on Delivery
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay when you receive your order
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Your payment information is encrypted and secure
                  </div>
                </div>
              )}

              {/* Review Step */}
              {step === 'review' && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl mb-6">Review Your Order</h2>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {shippingAddress.firstName} {shippingAddress.lastName}<br />
                      {shippingAddress.street}
                      {shippingAddress.apartment && `, ${shippingAddress.apartment}`}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}<br />
                      {shippingAddress.country}
                      {shippingAddress.phone && <><br />Phone: {shippingAddress.phone}</>}
                      {shippingAddress.email && <><br />Email: {shippingAddress.email}</>}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => setStep('shipping')}
                      type="button"
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod === 'CARD' ? 'Credit / Debit Card' : 'Cash on Delivery'}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => setStep('payment')}
                      type="button"
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium">Items ({cartItems.length})</h3>
                    {cartItems.map(item => (
                      <div key={item.productId} className="flex gap-4 p-3 bg-card rounded-lg border">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × Rs. {item.price.toFixed(2)}
                          </p>
                        </div>
                        <span className="font-medium">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                {step !== 'shipping' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step === 'review' ? 'payment' : 'shipping')}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending
                    ? 'Processing...'
                    : step === 'review'
                      ? paymentMethod === 'CARD'
                        ? `Pay Rs. ${total.toFixed(2)}`
                        : `Place Order - Rs. ${total.toFixed(2)}`
                      : 'Continue'
                  }
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl border p-6">
              <h2 className="font-display text-xl mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({cartItems.length} items)
                  </span>
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
