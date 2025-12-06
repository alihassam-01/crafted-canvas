import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, Truck, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { orderService } from '@/services/order.service';

const statusConfig: Record<string, { icon: typeof Package; color: string; label: string }> = {
  PENDING: { icon: Clock, color: 'text-yellow-500', label: 'Pending' },
  CONFIRMED: { icon: CheckCircle, color: 'text-blue-500', label: 'Confirmed' },
  PROCESSING: { icon: Package, color: 'text-purple-500', label: 'Processing' },
  SHIPPED: { icon: Truck, color: 'text-primary', label: 'Shipped' },
  DELIVERED: { icon: CheckCircle, color: 'text-sage-dark', label: 'Delivered' },
  CANCELLED: { icon: XCircle, color: 'text-destructive', label: 'Cancelled' },
  REFUNDED: { icon: XCircle, color: 'text-destructive', label: 'Refunded' },
};

export default function Orders() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['my-orders-full'],
    queryFn: () => orderService.listOrders({ limit: 50 }),
  });

  const orders = ordersData?.data?.items || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">My Orders</h1>
        <Badge variant="secondary">{ordersData?.data?.pagination?.total || 0} orders</Badge>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = status.icon;

            return (
              <div key={order.id} className="bg-card rounded-xl border overflow-hidden">
                {/* Order Header */}
                <div className="p-4 bg-muted/30 border-b flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <StatusIcon className={cn('h-5 w-5', status.color)} />
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={order.status === 'DELIVERED' ? 'success' : 'secondary'}>
                    {status.label}
                  </Badge>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <Link to={`/products/${item.productId}`}>
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link
                          to={`/products/${item.productId}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        {/* <p className="text-sm text-muted-foreground">
                          {item.product.shop.name}
                        </p> */}
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                          {/* {item.size && ` • Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`} */}
                        </p>
                        <p className="font-medium mt-1">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="p-4 border-t flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* {order.trackingNumber && (
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                    )} */}
                    <Button variant="outline" size="sm">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-display text-xl mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Start shopping to see your orders here.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
