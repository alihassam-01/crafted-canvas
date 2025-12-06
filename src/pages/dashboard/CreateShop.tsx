import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, Store } from 'lucide-react';
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
import { shopService } from '@/services/shop.service';

const categories = [
    { value: 'CROCHET', label: 'Crochet' },
    { value: 'ART', label: 'Art' },
    { value: 'PAINTING', label: 'Painting' },
    { value: 'HANDCRAFT', label: 'Handicraft' },
];

export default function CreateShop() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const shopData = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            contactEmail: formData.get('contactEmail'),
            contactPhone: formData.get('contactPhone'),
            address: {
                street: formData.get('street'),
                city: formData.get('city'),
                state: formData.get('state'),
                country: formData.get('country'),
                postalCode: formData.get('postalCode'),
            },
            // Optional fields can be added later or handled here
        };

        try {
            await shopService.createShop(shopData);
            toast({
                title: 'Success',
                description: 'Shop created successfully!',
            });
            navigate('/dashboard/shop');
        } catch (error) {
            console.error('Failed to create shop:', error);
            toast({
                title: 'Error',
                description: 'Failed to create shop. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="text-center mb-8">
                <Store className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h1 className="font-display text-3xl mb-2">Create Your Shop</h1>
                <p className="text-muted-foreground">
                    Start your journey as a seller on Crevea.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-xl border">
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Shop Name</Label>
                        <Input id="name" name="name" required placeholder="My Awesome Shop" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            placeholder="Tell us about your shop..."
                            className="min-h-[100px]"
                        />
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

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input id="contactEmail" name="contactEmail" type="email" required placeholder="shop@example.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input id="contactPhone" name="contactPhone" type="tel" required placeholder="+1234567890" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium">Address</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="street">Street Address</Label>
                            <Input id="street" name="street" required placeholder="123 Main St" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" required placeholder="New York" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" name="state" required placeholder="NY" />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" name="country" required placeholder="USA" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input id="postalCode" name="postalCode" required placeholder="10001" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Shop
                    </Button>
                </div>
            </form>
        </div>
    );
}
