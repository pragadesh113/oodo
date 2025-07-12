// Demo Data for Testing
const DemoData = {
    // Sample users
    users: [
        {
            id: 'user1',
            username: 'EcoFashionista',
            email: 'eco@example.com',
            points: 25,
            joinDate: new Date('2024-01-15'),
            isAdmin: false
        },
        {
            id: 'user2',
            username: 'SustainableStyle',
            email: 'sustain@example.com',
            points: 18,
            joinDate: new Date('2024-02-20'),
            isAdmin: false
        },
        {
            id: 'admin1',
            username: 'AdminUser',
            email: 'admin@example.com', // Change this to your actual admin email
            points: 100,
            joinDate: new Date('2024-01-01'),
            isAdmin: true
        }
    ],

    // Sample items
    items: [
        {
            id: 'item1',
            title: 'Vintage Denim Jacket',
            description: 'Classic blue denim jacket in excellent condition. Perfect for layering and adding a vintage touch to any outfit.',
            category: 'outerwear',
            type: 'jacket',
            size: 'M',
            condition: 'good',
            tags: ['vintage', 'denim', 'casual', 'layering'],
            images: [
                'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
                'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
            ],
            points: 15,
            userId: 'user1',
            userName: 'EcoFashionista',
            status: 'available',
            createdAt: new Date('2024-03-01'),
            updatedAt: new Date('2024-03-01')
        },
        {
            id: 'item2',
            title: 'Floral Summer Dress',
            description: 'Beautiful floral print summer dress, perfect for warm weather. Lightweight and comfortable fabric.',
            category: 'dresses',
            type: 'casual dress',
            size: 'S',
            condition: 'like new',
            tags: ['floral', 'summer', 'casual', 'lightweight'],
            images: [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
            ],
            points: 18,
            userId: 'user2',
            userName: 'SustainableStyle',
            status: 'available',
            createdAt: new Date('2024-03-05'),
            updatedAt: new Date('2024-03-05')
        },
        {
            id: 'item3',
            title: 'Black Skinny Jeans',
            description: 'High-quality black skinny jeans. Great fit and very comfortable. Goes with everything!',
            category: 'bottoms',
            type: 'jeans',
            size: 'M',
            condition: 'good',
            tags: ['black', 'skinny', 'versatile', 'comfortable'],
            images: [
                'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
            ],
            points: 12,
            userId: 'user1',
            userName: 'EcoFashionista',
            status: 'available',
            createdAt: new Date('2024-03-10'),
            updatedAt: new Date('2024-03-10')
        },
        {
            id: 'item4',
            title: 'Cozy Knit Sweater',
            description: 'Soft and warm knit sweater in cream color. Perfect for fall and winter.',
            category: 'tops',
            type: 'sweater',
            size: 'L',
            condition: 'new',
            tags: ['knit', 'cozy', 'warm', 'cream'],
            images: [
                'https://images.unsplash.com/photo-1544441893-675973e31985?w=400'
            ],
            points: 20,
            userId: 'user2',
            userName: 'SustainableStyle',
            status: 'available',
            createdAt: new Date('2024-03-12'),
            updatedAt: new Date('2024-03-12')
        },
        {
            id: 'item5',
            title: 'Leather Ankle Boots',
            description: 'Genuine leather ankle boots in brown. Comfortable and stylish for any season.',
            category: 'shoes',
            type: 'boots',
            size: '8',
            condition: 'good',
            tags: ['leather', 'boots', 'brown', 'comfortable'],
            images: [
                'https://images.unsplash.com/photo-1544966503-7cc0ac882d5f?w=400'
            ],
            points: 16,
            userId: 'user1',
            userName: 'EcoFashionista',
            status: 'available',
            createdAt: new Date('2024-03-15'),
            updatedAt: new Date('2024-03-15')
        }
    ],

    // Sample swaps
    swaps: [
        {
            id: 'swap1',
            itemId: 'item1',
            itemTitle: 'Vintage Denim Jacket',
            ownerId: 'user1',
            userId: 'user2',
            userName: 'SustainableStyle',
            status: 'pending',
            type: 'swap',
            date: new Date('2024-03-20'),
            message: 'SustainableStyle wants to swap for Vintage Denim Jacket'
        },
        {
            id: 'swap2',
            itemId: 'item2',
            itemTitle: 'Floral Summer Dress',
            ownerId: 'user2',
            userId: 'user1',
            userName: 'EcoFashionista',
            status: 'completed',
            type: 'points',
            points: 18,
            date: new Date('2024-03-18'),
            message: 'EcoFashionista redeemed Floral Summer Dress for 18 points'
        }
    ],

    // Load demo data into Firebase (for testing)
    async loadDemoData() {
        if (!window.firebaseServices) {
            console.error('Firebase not initialized');
            return;
        }

        try {
            console.log('Loading demo data...');

            // Load users (this would normally be done through registration)
            const usersPromises = this.users.map(async (user) => {
                const userRef = window.firebaseServices.db.collection('users').doc(user.id);
                const userDoc = await userRef.get();
                if (!userDoc.exists) {
                    await userRef.set({
                        ...user,
                        joinDate: user.joinDate
                    });
                }
            });
            await Promise.all(usersPromises);

            // Load items
            const itemsPromises = this.items.map(async (item) => {
                const itemRef = window.firebaseServices.db.collection('items').doc(item.id);
                const itemDoc = await itemRef.get();
                if (!itemDoc.exists) {
                    await itemRef.set({
                        ...item,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
                    });
                }
            });
            await Promise.all(itemsPromises);

            // Load swaps
            const swapsPromises = this.swaps.map(async (swap) => {
                const swapRef = window.firebaseServices.db.collection('swaps').doc(swap.id);
                const swapDoc = await swapRef.get();
                if (!swapDoc.exists) {
                    await swapRef.set({
                        ...swap,
                        date: swap.date
                    });
                }
            });
            await Promise.all(swapsPromises);

            console.log('Demo data loaded successfully!');
        } catch (error) {
            console.error('Error loading demo data:', error);
        }
    },

    // Clear all demo data
    async clearDemoData() {
        if (!window.firebaseServices) {
            console.error('Firebase not initialized');
            return;
        }

        try {
            console.log('Clearing demo data...');

            // Clear items
            const itemsSnapshot = await window.firebaseServices.db.collection('items').get();
            const deleteItemsPromises = itemsSnapshot.docs.map(doc => doc.ref.delete());
            await Promise.all(deleteItemsPromises);

            // Clear swaps
            const swapsSnapshot = await window.firebaseServices.db.collection('swaps').get();
            const deleteSwapsPromises = swapsSnapshot.docs.map(doc => doc.ref.delete());
            await Promise.all(deleteSwapsPromises);

            console.log('Demo data cleared successfully!');
        } catch (error) {
            console.error('Error clearing demo data:', error);
        }
    }
};

// Make DemoData available globally
window.DemoData = DemoData;

// Auto-load demo data in development (comment out for production)
// window.addEventListener('load', () => {
//     setTimeout(() => {
//         if (window.firebaseServices && window.location.hostname === 'localhost') {
//             DemoData.loadDemoData();
//         }
//     }, 2000);
// });