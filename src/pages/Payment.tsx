import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, Lock, Check, ChevronRight,
  MapPin, Truck
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { mockCartItems } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Payment() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = mockCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('review');
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/dashboard/orders');
      }, 2000);
    }
  };

  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ];

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
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input id="apartment" />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="saveAddress" />
                    <label htmlFor="saveAddress" className="text-sm">
                      Save this address for future orders
                    </label>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-xl">Shipping Method</h3>
                  </div>

                  <RadioGroup defaultValue="standard">
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
                      <span className={cn(shipping === 0 ? 'text-sage-dark font-medium' : '')}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
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
                      <span>$19.99</span>
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

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className={cn(
                      'p-4 border rounded-lg transition-colors',
                      paymentMethod === 'card' && 'border-primary'
                    )}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="font-medium">
                          Credit / Debit Card
                        </Label>
                      </div>
                      
                      {paymentMethod === 'card' && (
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
                      paymentMethod === 'paypal' && 'border-primary'
                    )}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="font-medium">
                          PayPal
                        </Label>
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
                      John Doe<br />
                      123 Main Street<br />
                      Portland, OR 97201<br />
                      United States
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={() => setStep('shipping')}
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-sm text-muted-foreground">
                      Visa ending in 4242
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={() => setStep('payment')}
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium">Items ({mockCartItems.length})</h3>
                    {mockCartItems.map(item => (
                      <div key={item.id} className="flex gap-4 p-3 bg-card rounded-lg border">
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
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
                <Button type="submit" className="flex-1" disabled={isProcessing}>
                  {isProcessing 
                    ? 'Processing...' 
                    : step === 'review' 
                    ? `Pay $${total.toFixed(2)}` 
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
                    Subtotal ({mockCartItems.length} items)
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={cn(shipping === 0 && 'text-sage-dark')}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
