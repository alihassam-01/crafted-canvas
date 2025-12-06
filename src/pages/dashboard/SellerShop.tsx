import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Package, Edit, Trash2, Loader2, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { productService } from '@/services/product.service';
import { shopService } from '@/services/shop.service';
import { authService } from '@/services/auth.service';

export default function SellerShop() {
    const { data: userData } = useQuery({
        queryKey: ['user'],
        queryFn: authService.getCurrentUser,
    });

    const user = userData?.data;

    const { data: shopData, isLoading: isShopLoading } = useQuery({
        queryKey: ['my-shop'],
        queryFn: async () => {
            const response = await shopService.getMyShops();
            return response.data[0];
        },
        enabled: !!user,
    });

    const shop = shopData;

    const { data: productsData, isLoading: isProductsLoading } = useQuery({
        queryKey: ['my-products', shop?.id],
        queryFn: () => productService.getShopProducts(shop!.id, { limit: 50 }),
        enabled: !!shop,
    });

    const products = productsData?.data?.items || [];

    if (isShopLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="text-center py-20">
                <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-display mb-2">You don't have a shop yet</h2>
                <p className="text-muted-foreground mb-6">Start selling your handmade treasures today!</p>
                <Button asChild>
                    <Link to="/dashboard/shop/create">Create Shop</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl">{shop.name}</h1>
                    <p className="text-muted-foreground text-sm">Manage your shop and products</p>
                </div>
                <Button asChild>
                    <Link to="/dashboard/shop/add-product">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Link>
                </Button>
            </div>

            <div className="bg-card rounded-xl border">
                <div className="p-6 border-b">
                    <h2 className="font-semibold text-lg">Products ({products.length})</h2>
                </div>

                {isProductsLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="divide-y">
                        {products.map((product) => (
                            <div key={product.id} className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={product.images[0] || '/placeholder-product.jpg'}
                                        alt={product.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h3 className="font-medium">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            ${product.price.toFixed(2)} • Stock: {product.stock}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={product.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                        {product.status}
                                    </Badge>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-medium mb-2">No products yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Add your first product to start selling.
                        </p>
                        <Button asChild variant="outline">
                            <Link to="/dashboard/shop/add-product">
                                Add Product
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
