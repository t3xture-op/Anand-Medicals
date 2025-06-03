import { useCartStore } from '../store/cartStore';
import { ShoppingCart } from 'lucide-react';

const categories = {
  veterinary: {
    name: 'Veterinary',
    description: 'Quality medicines and supplements for your pets',
    products: [
      {
        id: 'vet1',
        name: 'Pet Multivitamins',
        price: 299.99,
        description: 'Complete nutritional supplement for pets',
        category: 'veterinary',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=60',
        stock: 50,
        manufacturer: 'PetCare Plus'
      },
      {
        id: 'vet2',
        name: 'Joint Health Supplement',
        price: 449.99,
        description: 'Support healthy joints in dogs and cats',
        category: 'veterinary',
        image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=60',
        stock: 40,
        manufacturer: 'VetChoice'
      }
    ]
  },
  pediatric: {
    name: 'Pediatric',
    description: 'Specialized healthcare products for children',
    products: [
      {
        id: 'ped1',
        name: 'Kids Multivitamin Syrup',
        price: 199.99,
        description: 'Complete nutrition for growing children',
        category: 'pediatric',
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&auto=format&fit=crop&q=60',
        stock: 75,
        manufacturer: 'ChildCare'
      },
      {
        id: 'ped2',
        name: 'Baby Fever Relief',
        price: 149.99,
        description: 'Safe and effective fever reduction for infants',
        category: 'pediatric',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60',
        stock: 100,
        manufacturer: 'BabyCare'
      }
    ]
  },
  diaper: {
    name: 'Diapers & Baby Care',
    description: 'Essential baby care products and accessories',
    products: [
      {
        id: 'dia1',
        name: 'Premium Baby Diapers',
        price: 499.99,
        description: 'Ultra-soft diapers, pack of 40',
        category: 'diaper',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60',
        stock: 200,
        manufacturer: 'BabyCare'
      },
      {
        id: 'dia2',
        name: 'Baby Wipes Pack',
        price: 149.99,
        description: 'Gentle and safe baby wipes, pack of 72',
        category: 'diaper',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60',
        stock: 150,
        manufacturer: 'BabyCare'
      }
    ]
  },
  cosmetic: {
    name: 'Cosmetics',
    description: 'Premium skincare and beauty products',
    products: [
      {
        id: 'cos1',
        name: 'Hydrating Face Cream',
        price: 299.99,
        description: 'Deep moisturizing face cream',
        category: 'cosmetic',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60',
        stock: 60,
        manufacturer: 'GlowSkin'
      },
      {
        id: 'cos2',
        name: 'Vitamin C Serum',
        price: 399.99,
        description: 'Brightening and anti-aging serum',
        category: 'cosmetic',
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&auto=format&fit=crop&q=60',
        stock: 45,
        manufacturer: 'GlowSkin'
      }
    ]
  }
};

export default function Categories() {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h1>
        
        <div className="space-y-12">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                <p className="mt-2 text-gray-600">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {category.products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg border shadow-sm">
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-green-700">₹{product.price}</span>
                        <span className="text-sm text-gray-500">{product.stock} in stock</span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
