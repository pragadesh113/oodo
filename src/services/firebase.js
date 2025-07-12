// Firebase Service Functions
const FirebaseService = {
    // User Management
    async createUser(email, password, username) {
        try {
            const result = await window.firebaseServices.auth.createUserWithEmailAndPassword(email, password);
            
            // Update user profile
            await result.user.updateProfile({
                displayName: username
            });

            // Create user document
            await window.firebaseServices.db.collection('users').doc(result.user.uid).set({
                username: username,
                email: email,
                points: 0,
                joinDate: new Date(),
                isAdmin: false
            });

            return result.user;
        } catch (error) {
            throw error;
        }
    },

    async signInUser(email, password) {
        try {
            const result = await window.firebaseServices.auth.signInWithEmailAndPassword(email, password);
            return result.user;
        } catch (error) {
            throw error;
        }
    },

    async signOutUser() {
        try {
            await window.firebaseServices.auth.signOut();
        } catch (error) {
            throw error;
        }
    },

    // Item Management
    async createItem(itemData) {
        try {
            const docRef = await window.firebaseServices.db.collection('items').add({
                ...itemData,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'available'
            });
            return docRef.id;
        } catch (error) {
            throw error;
        }
    },

    async getItems(filters = {}) {
        try {
            let query = window.firebaseServices.db.collection('items');

            if (filters.status) {
                query = query.where('status', '==', filters.status);
            }
            if (filters.category) {
                query = query.where('category', '==', filters.category);
            }
            if (filters.userId) {
                query = query.where('userId', '==', filters.userId);
            }

            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    },

    async updateItem(itemId, updateData) {
        try {
            await window.firebaseServices.db.collection('items').doc(itemId).update({
                ...updateData,
                updatedAt: new Date()
            });
        } catch (error) {
            throw error;
        }
    },

    async deleteItem(itemId) {
        try {
            await window.firebaseServices.db.collection('items').doc(itemId).delete();
        } catch (error) {
            throw error;
        }
    },

    // Swap Management
    async createSwap(swapData) {
        try {
            const docRef = await window.firebaseServices.db.collection('swaps').add({
                ...swapData,
                date: new Date()
            });
            return docRef.id;
        } catch (error) {
            throw error;
        }
    },

    async getSwaps(filters = {}) {
        try {
            let query = window.firebaseServices.db.collection('swaps');

            if (filters.userId) {
                query = query.where('userId', '==', filters.userId);
            }
            if (filters.ownerId) {
                query = query.where('ownerId', '==', filters.ownerId);
            }
            if (filters.status) {
                query = query.where('status', '==', filters.status);
            }

            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    },

    // User Profile Management
    async getUserProfile(userId) {
        try {
            const doc = await window.firebaseServices.db.collection('users').doc(userId).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            throw error;
        }
    },

    async updateUserProfile(userId, updateData) {
        try {
            await window.firebaseServices.db.collection('users').doc(userId).update({
                ...updateData,
                updatedAt: new Date()
            });
        } catch (error) {
            throw error;
        }
    },

    async updateUserPoints(userId, points) {
        try {
            const userRef = window.firebaseServices.db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
                const currentPoints = userDoc.data().points || 0;
                await userRef.update({
                    points: currentPoints + points
                });
            }
        } catch (error) {
            throw error;
        }
    },

    // File Upload
    async uploadImage(file, path) {
        try {
            const storageRef = window.firebaseServices.storage.ref(path);
            const snapshot = await storageRef.put(file);
            return await snapshot.ref.getDownloadURL();
        } catch (error) {
            throw error;
        }
    },

    async uploadMultipleImages(files, basePath) {
        try {
            const uploadPromises = files.map(async (file, index) => {
                const path = `${basePath}/${Date.now()}_${index}`;
                return await this.uploadImage(file, path);
            });
            return await Promise.all(uploadPromises);
        } catch (error) {
            throw error;
        }
    },

    // Admin Functions
    async getAllUsers() {
        try {
            const snapshot = await window.firebaseServices.db.collection('users').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    },

    async toggleUserAdmin(userId, isAdmin) {
        try {
            await window.firebaseServices.db.collection('users').doc(userId).update({
                isAdmin: !isAdmin
            });
        } catch (error) {
            throw error;
        }
    },

    // Utility Functions
    formatDate(timestamp) {
        if (!timestamp) return 'Recently';
        
        if (timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString();
        }
        
        return new Date(timestamp).toLocaleDateString();
    },

    calculateItemPoints(itemData) {
        let points = 10; // Base points
        
        if (itemData.condition === 'new') points += 5;
        else if (itemData.condition === 'like new') points += 3;
        else if (itemData.condition === 'good') points += 1;
        
        if (itemData.category === 'outerwear' || itemData.category === 'dresses') {
            points += 2;
        }
        
        return points;
    }
};

// Make FirebaseService available globally
window.FirebaseService = FirebaseService;