import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/product.service';
import { shopService } from '@/services/shop.service';
import { authService } from '@/services/auth.service';

const categories = [
    { value: 'crochet', label: 'Crochet' },
    { value: 'painting', label: 'Art & Painting' },
    { value: 'handicraft', label: 'Handicrafts' },
];

export default function AddProduct() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');

    const { data: userData } = useQuery({
        queryKey: ['user'],
        queryFn: authService.getCurrentUser,
    });

    const user = userData?.data;

    const { data: shopData } = useQuery({
        queryKey: ['my-shop'],
        queryFn: async () => {
            const response = await shopService.getMyShops();
            return response.data[0];
        },
        enabled: !!user,
    });

    const shop = shopData;

    const handleAddImage = () => {
        if (imageUrl && !images.includes(imageUrl)) {
            setImages([...images, imageUrl]);
            setImageUrl('');
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!shop) {
            toast({
                title: 'Error',
                description: 'Shop not found. Please try refreshing the page.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            shortDescription: formData.get('shortDescription'),
            price: parseFloat(formData.get('price') as string),
            stock: parseInt(formData.get('stock') as string),
            category: formData.get('category'),
            images: images,
            shopId: shop.id,
            status: 'ACTIVE', // Default to active for now
            tags: [], // TODO: Add tags input
        };

        try {
            await productService.createProduct(productData);
            toast({
                title: 'Success',
                description: 'Product created successfully',
            });
            navigate('/dashboard/shop');
        } catch (error) {
            console.error('Failed to create product:', error);
            toast({
                title: 'Error',
                description: 'Failed to create product. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="font-display text-2xl mb-2">Add New Product</h1>
                <p className="text-muted-foreground">
                    Fill in the details to list your new product.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" name="name" required placeholder="e.g. Handmade Wool Scarf" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="shortDescription">Short Description</Label>
                        <Input id="shortDescription" name="shortDescription" required placeholder="Brief summary for cards" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Full Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            placeholder="Detailed description of your product..."
                            className="min-h-[150px]"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" name="price" type="number" min="0" step="0.01" required placeholder="0.00" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" name="stock" type="number" min="0" required placeholder="1" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Images</Label>
                        <div className="flex gap-2">
                            <Input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Enter image URL"
                            />
                            <Button type="button" onClick={handleAddImage} variant="secondary">
                                Add
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            * For now, please provide direct image URLs. File upload coming soon.
                        </p>

                        {images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {images.map((url, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard/shop')}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Product
                    </Button>
                </div>
            </form>
        </div>
    );
}
