import { Link } from 'react-router-dom';
import { Package, ChevronRight, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/data/mockData';
import { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<OrderStatus, { icon: typeof Package; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-500', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-500', label: 'Confirmed' },
  processing: { icon: Package, color: 'text-purple-500', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-primary', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-sage-dark', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-destructive', label: 'Cancelled' },
};

export default function Orders() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">My Orders</h1>
        <Badge variant="secondary">{mockOrders.length} orders</Badge>
      </div>

      {mockOrders.length > 0 ? (
        <div className="space-y-4">
          {mockOrders.map((order) => {
            const status = statusConfig[order.status];
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
                  <Badge variant={order.status === 'delivered' ? 'success' : 'secondary'}>
                    {status.label}
                  </Badge>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <Link to={`/products/${item.product.slug}`}>
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link 
                          to={`/products/${item.product.slug}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.product.shop.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                          {item.size && ` • Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
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
                    {order.trackingNumber && (
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                    )}
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
