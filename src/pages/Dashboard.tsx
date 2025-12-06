import { Link, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User, Package, MessageCircle, Heart, Settings,
  LogOut, ChevronRight, Bell, Loader2, Store
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockConversations } from '@/data/mockData';
import { authService } from '@/services/auth.service';
import { orderService } from '@/services/order.service';
import { notificationService } from '@/services/notification.service';

const sidebarLinks = [
  { icon: User, label: 'Profile', href: '/dashboard' },
  { icon: Package, label: 'Orders', href: '/dashboard/orders' },
  { icon: MessageCircle, label: 'Messages', href: '/dashboard/messages', badge: 1 },
  { icon: Heart, label: 'Wishlist', href: '/dashboard/wishlist' },
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Dashboard() {
  const location = useLocation();

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.listNotifications({ limit: 5 }),
  });

  const user = userData?.data;
  const notifications = notificationsData?.data?.items || [];
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const isExactDashboard = location.pathname === '/dashboard';

  if (isUserLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  const allLinks = user.role === 'SELLER'
    ? [
      { icon: Store, label: 'My Shop', href: '/dashboard/shop' },
      ...sidebarLinks
    ]
    : sidebarLinks;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* User Info */}
              <div className="p-6 bg-card rounded-xl border text-center">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                  alt={user.firstName}
                  className="w-20 h-20 mx-auto rounded-full object-cover mb-4"
                />
                <h2 className="font-semibold text-lg">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.role === 'SELLER' && (
                  <Badge variant="secondary" className="mt-2">Seller</Badge>
                )}
              </div>

              {/* Navigation */}
              <nav className="bg-card rounded-xl border overflow-hidden">
                {allLinks.map((link) => {
                  const badgeCount = link.label === 'Notifications' ? unreadNotifications : (link as any).badge;

                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors',
                        location.pathname === link.href && 'bg-muted/50 border-l-2 border-primary'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className="h-5 w-5 text-muted-foreground" />
                        <span>{link.label}</span>
                      </div>
                      {badgeCount ? (
                        <Badge variant="default" className="h-5 min-w-[20px] flex items-center justify-center">
                          {badgeCount}
                        </Badge>
                      ) : null}
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    authService.logout();
                    window.location.href = '/auth';
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {isExactDashboard ? <DashboardOverview user={user} /> : <Outlet />}
          </main>
        </div>
      </div>
    </Layout>
  );
}

function DashboardOverview({ user }: { user: any }) {
  const { data: ordersData } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.listOrders({ limit: 3 }),
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.listNotifications({ limit: 3 }),
  });

  const recentOrders = ordersData?.data?.items || [];
  const notifications = notificationsData?.data?.items || [];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-hero rounded-2xl p-6 md:p-8">
        <h1 className="font-display text-2xl md:text-3xl mb-2">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: ordersData?.data?.pagination?.total || 0 },
          { label: 'Wishlist Items', value: 0 }, // TODO: Implement wishlist
          { label: 'Unread Messages', value: mockConversations.reduce((sum, c) => sum + c.unreadCount, 0) },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-display text-xl">Recent Orders</h2>
          <Button variant="ghost" asChild>
            <Link to="/dashboard/orders">
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="divide-y">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={order.items[0]?.image || '/placeholder-product.jpg'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item(s) • ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
              <Badge variant={order.status === 'DELIVERED' ? 'success' : 'secondary'} className="capitalize">
                {order.status.toLowerCase()}
              </Badge>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              No recent orders
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-xl border">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-display text-xl">Recent Notifications</h2>
          <Button variant="ghost" asChild>
            <Link to="/dashboard/notifications">
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="divide-y">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-6 flex items-start gap-4">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                notification.read ? 'bg-muted' : 'bg-primary/10'
              )}>
                <Bell className={cn(
                  'h-5 w-5',
                  notification.read ? 'text-muted-foreground' : 'text-primary'
                )} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              No new notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
