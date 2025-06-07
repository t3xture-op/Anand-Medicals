// Mock data for the admin panel

// Products
export const products = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Medicine',
    price: 15.99,
    stock: 120,
    sku: 'MED-PARA-500',
    image: 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg',
    description: 'Pain reliever and fever reducer',
    requiresPrescription: true,
    createdAt: '2023-10-10T10:00:00Z',
    updatedAt: '2023-10-10T10:00:00Z'
  },
  {
    id: '2',
    name: 'Baby Diaper Medium Size',
    category: 'Baby Products',
    price: 399.99,
    stock: 50,
    sku: 'BABY-DIA-MED',
    image: 'https://images.pexels.com/photos/6966/abstract-music-rock-bw.jpg',
    description: 'Pack of 40 diapers for babies 5-10 kg',
    requiresPrescription: false,
    createdAt: '2023-10-09T15:30:00Z',
    updatedAt: '2023-10-11T09:15:00Z'
  },
  {
    id: '3',
    name: 'Adult Diaper Large',
    category: 'Adult Products',
    price: 599.99,
    stock: 30,
    sku: 'ADULT-DIA-LG',
    image: 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg',
    description: 'Pack of 10 adult diapers for elderly care',
    requiresPrescription: false,
    createdAt: '2023-10-08T14:20:00Z',
    updatedAt: '2023-10-08T14:20:00Z'
  },
  {
    id: '4',
    name: 'Vitamin C 1000mg',
    category: 'Supplements',
    price: 299.99,
    stock: 80,
    sku: 'SUP-VITC-1000',
    image: 'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg',
    description: 'Immunity booster with 60 tablets',
    requiresPrescription: false,
    createdAt: '2023-10-07T11:45:00Z',
    updatedAt: '2023-10-07T11:45:00Z'
  },
  {
    id: '5',
    name: 'Blood Pressure Monitor',
    category: 'Medical Devices',
    price: 1999.99,
    stock: 15,
    sku: 'DEV-BP-MON',
    image: 'https://images.pexels.com/photos/6502306/pexels-photo-6502306.jpeg',
    description: 'Digital blood pressure monitor for home use',
    requiresPrescription: false,
    createdAt: '2023-10-06T13:10:00Z',
    updatedAt: '2023-10-12T16:30:00Z'
  },
  {
    id: '6',
    name: 'Amoxicillin 500mg',
    category: 'Medicine',
    price: 149.99,
    stock: 5,
    sku: 'MED-AMOX-500',
    image: 'https://images.pexels.com/photos/139398/himalayas-mountains-nepal-hill-139398.jpeg',
    description: 'Antibiotic for bacterial infections',
    requiresPrescription: true,
    createdAt: '2023-10-05T09:20:00Z',
    updatedAt: '2023-10-05T09:20:00Z'
  },
  {
    id: '7',
    name: 'Baby Shampoo',
    category: 'Baby Products',
    price: 199.99,
    stock: 40,
    sku: 'BABY-SHAM',
    image: 'https://images.pexels.com/photos/266004/pexels-photo-266004.jpeg',
    description: 'Gentle no-tears formula for babies',
    requiresPrescription: false,
    createdAt: '2023-10-04T14:50:00Z',
    updatedAt: '2023-10-04T14:50:00Z'
  },
  {
    id: '8',
    name: 'First Aid Kit',
    category: 'Medical Supplies',
    price: 499.99,
    stock: 25,
    sku: 'SUP-FAK',
    image: 'https://images.pexels.com/photos/9089359/pexels-photo-9089359.jpeg',
    description: 'Complete home first aid kit with 100 items',
    requiresPrescription: false,
    createdAt: '2023-10-03T10:30:00Z',
    updatedAt: '2023-10-03T10:30:00Z'
  }
];

// Product Categories
export const productCategories = [
  { id: '1', name: 'Medicine' },
  { id: '2', name: 'Baby Products' },
  { id: '3', name: 'Adult Products' },
  { id: '4', name: 'Supplements' },
  { id: '5', name: 'Medical Devices' },
  { id: '6', name: 'Medical Supplies' }
];

// Orders
export const orders = [
  {
    id: '1',
    orderNumber: 'ORD-2023-001',
    customerId: '1',
    customerName: 'Rahul Sharma',
    totalAmount: 599.97,
    status: 'delivered',
    paymentMethod: 'Google Pay',
    paymentStatus: 'paid',
    items: [
      { productId: '1', quantity: 2, price: 15.99, name: 'Paracetamol 500mg' },
      { productId: '4', quantity: 1, price: 299.99, name: 'Vitamin C 1000mg' }
    ],
    prescriptionRequired: true,
    prescriptionId: '1',
    prescriptionStatus: 'approved',
    shippingAddress: {
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    orderDate: '2023-10-15T09:30:00Z',
    deliveryDate: '2023-10-17T14:20:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2023-002',
    customerId: '2',
    customerName: 'Priya Patel',
    totalAmount: 1999.99,
    status: 'shipped',
    paymentMethod: 'PhonePe',
    paymentStatus: 'paid',
    items: [
      { productId: '5', quantity: 1, price: 1999.99, name: 'Blood Pressure Monitor' }
    ],
    prescriptionRequired: false,
    prescriptionId: null,
    prescriptionStatus: null,
    shippingAddress: {
      street: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    orderDate: '2023-10-14T11:45:00Z',
    deliveryDate: null
  },
  {
    id: '3',
    orderNumber: 'ORD-2023-003',
    customerId: '3',
    customerName: 'Amit Kumar',
    totalAmount: 749.98,
    status: 'processing',
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    items: [
      { productId: '6', quantity: 1, price: 149.99, name: 'Amoxicillin 500mg' },
      { productId: '7', quantity: 3, price: 199.99, name: 'Baby Shampoo' }
    ],
    prescriptionRequired: true,
    prescriptionId: '2',
    prescriptionStatus: 'pending',
    shippingAddress: {
      street: '789 Lake Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    orderDate: '2023-10-13T16:20:00Z',
    deliveryDate: null
  },
  {
    id: '4',
    orderNumber: 'ORD-2023-004',
    customerId: '4',
    customerName: 'Sneha Gupta',
    totalAmount: 999.97,
    status: 'pending',
    paymentMethod: 'PhonePe',
    paymentStatus: 'failed',
    items: [
      { productId: '2', quantity: 2, price: 399.99, name: 'Baby Diaper Medium Size' },
      { productId: '8', quantity: 1, price: 499.99, name: 'First Aid Kit' }
    ],
    prescriptionRequired: false,
    prescriptionId: null,
    prescriptionStatus: null,
    shippingAddress: {
      street: '101 Hill Avenue',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001'
    },
    orderDate: '2023-10-12T10:15:00Z',
    deliveryDate: null
  },
  {
    id: '5',
    orderNumber: 'ORD-2023-005',
    customerId: '5',
    customerName: 'Vikram Singh',
    totalAmount: 599.99,
    status: 'cancelled',
    paymentMethod: 'Google Pay',
    paymentStatus: 'refunded',
    items: [
      { productId: '3', quantity: 1, price: 599.99, name: 'Adult Diaper Large' }
    ],
    prescriptionRequired: false,
    prescriptionId: null,
    prescriptionStatus: null,
    shippingAddress: {
      street: '222 River Street',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700001'
    },
    orderDate: '2023-10-11T14:30:00Z',
    deliveryDate: null
  }
];

// Users
export const users = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9876543210',
    dateJoined: '2023-09-15T10:20:00Z',
    totalOrders: 5,
    totalSpent: 4599.85,
    addresses: [
      {
        id: '1',
        type: 'home',
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    ],
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '9876543211',
    dateJoined: '2023-09-20T14:30:00Z',
    totalOrders: 3,
    totalSpent: 3499.97,
    addresses: [
      {
        id: '2',
        type: 'home',
        street: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      }
    ],
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '9876543212',
    dateJoined: '2023-09-18T11:15:00Z',
    totalOrders: 2,
    totalSpent: 1249.96,
    addresses: [
      {
        id: '3',
        type: 'home',
        street: '789 Lake Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      }
    ],
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    email: 'sneha.gupta@example.com',
    phone: '9876543213',
    dateJoined: '2023-09-25T16:45:00Z',
    totalOrders: 1,
    totalSpent: 999.97,
    addresses: [
      {
        id: '4',
        type: 'home',
        street: '101 Hill Avenue',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001'
      }
    ],
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '9876543214',
    dateJoined: '2023-09-22T09:30:00Z',
    totalOrders: 1,
    totalSpent: 599.99,
    addresses: [
      {
        id: '5',
        type: 'home',
        street: '222 River Street',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700001'
      }
    ],
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  }
];

// Prescriptions
export const prescriptions = [
  {
    id: '1',
    orderId: '1',
    userId: '1',
    userName: 'Rahul Sharma',
    image: 'https://images.pexels.com/photos/4021806/pexels-photo-4021806.jpeg',
    status: 'approved',
    reviewedBy: 'Admin User',
    reviewDate: '2023-10-15T10:30:00Z',
    notes: 'Valid prescription, approved for medication.'
  },
  {
    id: '2',
    orderId: '3',
    userId: '3',
    userName: 'Amit Kumar',
    image: 'https://images.pexels.com/photos/4021804/pexels-photo-4021804.jpeg',
    status: 'pending',
    reviewedBy: null,
    reviewDate: null,
    notes: null
  },
  {
    id: '3',
    orderId: null,
    userId: '2',
    userName: 'Priya Patel',
    image: 'https://images.pexels.com/photos/4021822/pexels-photo-4021822.jpeg',
    status: 'rejected',
    reviewedBy: 'Admin User',
    reviewDate: '2023-10-10T14:15:00Z',
    notes: 'Prescription expired. Please upload a valid prescription.'
  }
];

// Offers & Discounts
export const offers = [
  {
    id: '1',
    code: 'WELCOME20',
    description: '20% off on your first order',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 500,
    maxDiscount: 200,
    startDate: '2023-10-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    usageLimit: 1000,
    usageCount: 145,
    status: 'active',
    createdAt: '2023-09-28T10:00:00Z'
  },
  {
    id: '2',
    code: 'FESTIVAL50',
    description: '₹50 off on orders above ₹1000',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 1000,
    maxDiscount: 50,
    startDate: '2023-10-15T00:00:00Z',
    endDate: '2023-10-31T23:59:59Z',
    usageLimit: 500,
    usageCount: 78,
    status: 'active',
    createdAt: '2023-10-10T15:30:00Z'
  },
  {
    id: '3',
    code: 'SUMMER15',
    description: '15% off on all supplements',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 0,
    maxDiscount: 100,
    startDate: '2023-04-01T00:00:00Z',
    endDate: '2023-06-30T23:59:59Z',
    usageLimit: 1000,
    usageCount: 723,
    status: 'expired',
    createdAt: '2023-03-25T09:15:00Z'
  }
];

// Notifications
export const notifications = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-2023-006 has been placed by Sanjay Verma',
    isRead: false,
    createdAt: '2023-10-16T10:15:00Z'
  },
  {
    id: '2',
    type: 'prescription',
    title: 'Prescription Review Required',
    message: 'A new prescription has been uploaded for order #ORD-2023-006',
    isRead: false,
    createdAt: '2023-10-16T10:20:00Z'
  },
  {
    id: '3',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Amoxicillin 500mg is running low on stock (5 remaining)',
    isRead: true,
    createdAt: '2023-10-15T16:30:00Z'
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Failure',
    message: 'Payment for order #ORD-2023-004 has failed',
    isRead: true,
    createdAt: '2023-10-12T11:45:00Z'
  },
  {
    id: '5',
    type: 'user',
    title: 'New User Registration',
    message: 'Sanjay Verma has registered a new account',
    isRead: true,
    createdAt: '2023-10-16T09:50:00Z'
  }
];

// Dashboard Stats for Analytics
export const dashboardStats = {
  totalSales: 10949.74,
  totalOrders: 12,
  totalUsers: 8,
  pendingOrders: 3,
  lowStockProducts: 2,
  pendingPrescriptions: 1,
  salesChart: {
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    data: [5428.45, 6982.30, 8245.65, 9120.80, 10949.74]
  },
  orderStatusChart: {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    data: [2, 3, 2, 4, 1]
  },
  topSellingProducts: [
    { id: '2', name: 'Baby Diaper Medium Size', sold: 15, revenue: 5999.85 },
    { id: '5', name: 'Blood Pressure Monitor', sold: 8, revenue: 15999.92 },
    { id: '1', name: 'Paracetamol 500mg', sold: 30, revenue: 479.70 },
    { id: '4', name: 'Vitamin C 1000mg', sold: 12, revenue: 3599.88 }
  ],
  recentActivity: [
    { 
      id: '1', 
      type: 'order', 
      action: 'New Order #ORD-2023-006', 
      time: '10:15 AM', 
      date: '16 Oct 2023' 
    },
    { 
      id: '2', 
      type: 'user', 
      action: 'New User: Sanjay Verma', 
      time: '09:50 AM', 
      date: '16 Oct 2023' 
    },
    { 
      id: '3', 
      type: 'prescription', 
      action: 'Prescription Uploaded for #ORD-2023-006', 
      time: '10:20 AM', 
      date: '16 Oct 2023' 
    },
    { 
      id: '4', 
      type: 'order', 
      action: 'Order #ORD-2023-002 Shipped', 
      time: '03:45 PM', 
      date: '15 Oct 2023' 
    },
    { 
      id: '5', 
      type: 'stock', 
      action: 'Low Stock Alert: Amoxicillin 500mg', 
      time: '04:30 PM', 
      date: '15 Oct 2023' 
    }
  ]
};