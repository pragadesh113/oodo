// Main App Component - UPDATED
const { useState, useEffect, createContext, useContext } = React;

// Firebase Configuration Check Component
const FirebaseConfigCheck = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="text-6xl mb-6">🔧</div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Firebase Setup Required
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please configure your Firebase project to use ReWear
                    </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-yellow-800 text-sm">
                        <strong>Next Steps:</strong>
                        <ol className="mt-2 list-decimal list-inside space-y-1">
                            <li>Create a Firebase project</li>
                            <li>Enable Auth, Firestore, and Storage</li>
                            <li>Update the firebaseConfig in index.html</li>
                            <li>Refresh this page</li>
                        </ol>
                    </div>
                </div>
                
                <div className="flex space-x-3">
                    <a
                        href="test.html"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                    >
                        🧪 Test Connection
                    </a>
                    <a
                        href="SETUP.md"
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg text-center hover:bg-gray-700 transition-colors"
                    >
                        📖 Setup Guide
                    </a>
                </div>
            </div>
        </div>
    );
};

// Firebase Error Component
const FirebaseError = ({ error }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="text-6xl mb-6">❌</div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-red-900">
                        Firebase Connection Error
                    </h2>
                    <p className="mt-2 text-center text-sm text-red-600">
                        There was an error connecting to Firebase
                    </p>
                </div>
                
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                    <div className="text-red-800 text-sm">
                        <strong>Error:</strong>
                        <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{error}</pre>
                    </div>
                </div>
                
                <div className="flex space-x-3">
                    <a
                        href="test.html"
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-center hover:bg-red-700 transition-colors"
                    >
                        🧪 Test Connection
                    </a>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        </div>
    );
};

// Create Auth Context
const AuthContext = createContext();

// Custom hook for authentication
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = window.firebaseServices.auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            const result = await window.firebaseServices.auth.signInWithEmailAndPassword(email, password);
            return result.user;
        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password, username) => {
        try {
            const result = await window.firebaseServices.auth.createUserWithEmailAndPassword(email, password);
            
            // Update user profile with username
            await result.user.updateProfile({
                displayName: username
            });

            // Create user document in Firestore
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
    };

    const logout = async () => {
        try {
            await window.firebaseServices.auth.signOut();
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Main App Component
const App = () => {
    const [currentPage, setCurrentPage] = useState('landing');
    const [selectedItem, setSelectedItem] = useState(null);
    const [firebaseStatus, setFirebaseStatus] = useState('checking');
    const [navigationHistory, setNavigationHistory] = useState(['landing']);

    useEffect(() => {
        // Check Firebase configuration status
        const checkFirebase = () => {
            // Check if firebaseServices is available
            if (window.firebaseServices) {
                setFirebaseStatus('ready');
                return;
            }
            
            // Check for configuration issues
            setTimeout(() => {
                if (!window.firebaseServices) {
                    setFirebaseStatus('not-configured');
                }
            }, 1000);
        };
        
        checkFirebase();
    }, []);

    const navigateTo = (page, data = null) => {
        // Add current page to history if it's different
        if (page !== currentPage) {
            setNavigationHistory(prev => [...prev, currentPage]);
            console.log(`Navigating from ${currentPage} to ${page}`);
        }
        setCurrentPage(page);
        if (data) {
            setSelectedItem(data);
        }
    };

    const goBack = () => {
        if (navigationHistory.length > 0) {
            const newHistory = [...navigationHistory];
            const previousPage = newHistory.pop();
            setNavigationHistory(newHistory);
            setCurrentPage(previousPage);
        } else {
            // If no history, go to landing
            setCurrentPage('landing');
        }
    };

    // Show loading while checking Firebase
    if (firebaseStatus === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="loading-spinner mb-4"></div>
                    <p className="text-gray-600">Loading ReWear...</p>
                </div>
            </div>
        );
    }

    // Show configuration error
    if (firebaseStatus === 'not-configured') {
        return <FirebaseConfigCheck />;
    }

    const renderPage = () => {
        const pageProps = { navigateTo, goBack, currentPage };
        
        switch (currentPage) {
            case 'landing':
                return <LandingPage {...pageProps} />;
            case 'login':
                return <LoginPage {...pageProps} />;
            case 'register':
                return <RegisterPage {...pageProps} />;
            case 'dashboard':
                return <DashboardPage {...pageProps} />;
            case 'items':
                return <ItemListingPage {...pageProps} />;
            case 'item-detail':
                return <ItemDetailPage item={selectedItem} {...pageProps} />;
            case 'add-item':
                return <AddItemPage {...pageProps} />;
            case 'admin':
                return <AdminPanel {...pageProps} />;
            default:
                return <LandingPage {...pageProps} />;
        }
    };

    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50">
                {renderPage()}
            </div>
        </AuthProvider>
    );
};

// Navigation Component
const Navigation = ({ navigateTo, currentPage }) => {
    const { user, logout } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user) {
            checkAdminStatus();
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    const checkAdminStatus = async () => {
        try {
            const userDoc = await window.firebaseServices.db
                .collection('users')
                .doc(user.uid)
                .get();
            
            if (userDoc.exists && userDoc.data().isAdmin) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigateTo('landing');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigateTo('landing')}
                            className="flex items-center space-x-2 text-rewear-primary font-bold text-xl hover:text-rewear-secondary transition-colors"
                        >
                            <span className="text-2xl">👗</span>
                            <span>ReWear</span>
                        </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigateTo('items')}
                            className={`text-gray-700 hover:text-green-600 transition-colors ${
                                currentPage === 'items' ? 'text-white font-bold bg-green-600 px-4 py-2 rounded-lg shadow-lg transform scale-110' : ''
                            }`}
                        >
                            Browse Items
                        </button>
                        
                        {user ? (
                            <>
                                <button
                                    onClick={() => navigateTo('dashboard')}
                                    className={`text-gray-700 hover:text-green-600 transition-colors ${
                                        currentPage === 'dashboard' ? 'text-white font-bold bg-green-600 px-4 py-2 rounded-lg shadow-lg transform scale-110' : ''
                                    }`}
                                >
                                    Dashboard
                                </button>
                                
                                {isAdmin && (
                                    <button
                                        onClick={() => navigateTo('admin')}
                                        className={`text-orange-600 hover:text-orange-700 font-medium transition-colors ${
                                            currentPage === 'admin' ? 'text-white font-bold bg-green-600 px-4 py-2 rounded-lg shadow-lg transform scale-110' : ''
                                        }`}
                                    >
                                        🛡️ Admin Panel
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => navigateTo('add-item')}
                                    className={`text-gray-700 hover:text-green-600 transition-colors ${
                                        currentPage === 'add-item' ? 'text-white font-bold bg-green-600 px-4 py-2 rounded-lg shadow-lg transform scale-110' : ''
                                    }`}
                                >
                                    List Item
                                </button>
                                

                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                                <div className="text-sm text-gray-600">
                                    {user.displayName || user.email}
                                    {isAdmin && <span className="text-orange-600 block text-xs font-medium">🛡️ Admin</span>}
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigateTo('login')}
                                    className="text-gray-700 hover:text-rewear-primary transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigateTo('register')}
                                    className="bg-rewear-primary text-white px-4 py-2 rounded-lg hover:bg-rewear-secondary transition-colors"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Landing Page Component
const LandingPage = ({ navigateTo, currentPage }) => {
    const { user } = useAuth();
    const [featuredItems, setFeaturedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    
    const bannerImages = [
        { 
            url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
            title: 'Sustainable Fashion Starts Here',
            subtitle: 'Join the circular economy movement'
        },
        {
            url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=400&fit=crop',
            title: 'Trade, Share, Renew',
            subtitle: 'Give your clothes a second life'
        },
        {
            url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=400&fit=crop',
            title: 'Community Powered Exchange',
            subtitle: 'Connect with fashion lovers near you'
        }
    ];
    
    const categories = [
        { name: 'Women', icon: '👗', color: 'bg-pink-100 text-pink-600' },
        { name: 'Men', icon: '👔', color: 'bg-blue-100 text-blue-600' },
        { name: 'Accessories', icon: '👜', color: 'bg-purple-100 text-purple-600' },
        { name: 'Shoes', icon: '👠', color: 'bg-green-100 text-green-600' },
        { name: 'Kids', icon: '👶', color: 'bg-yellow-100 text-yellow-600' },
        { name: 'Vintage', icon: '🕰️', color: 'bg-amber-100 text-amber-600' }
    ];

    useEffect(() => {
        fetchFeaturedItems();
        
        // Auto-rotate banner images
        const bannerInterval = setInterval(() => {
            setCurrentBannerIndex(prev => (prev + 1) % bannerImages.length);
        }, 5000);
        
        return () => clearInterval(bannerInterval);
    }, []);

    const fetchFeaturedItems = async () => {
        try {
            const snapshot = await window.firebaseServices.db
                .collection('items')
                .where('status', '==', 'available')
                .limit(6)
                .get();

            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setFeaturedItems(items);
        } catch (error) {
            console.error('Error fetching featured items:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Navigation navigateTo={navigateTo} currentPage="landing" />
            
            {/* Hero Section */}
            <section className="gradient-bg text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Sustainable Fashion,
                            <br />
                            <span className="text-rewear-accent">Community Driven</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Join ReWear and be part of the circular fashion economy. Exchange unused clothing, 
                            earn points, and contribute to a more sustainable future.
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <button
                                onClick={() => navigateTo(user ? 'items' : 'register')}
                                className="bg-white text-rewear-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Start Swapping
                            </button>
                            <button
                                onClick={() => navigateTo('items')}
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-rewear-primary transition-colors"
                            >
                                Browse Items
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Banner Carousel */}
            <section className="relative h-96 overflow-hidden">
                <div 
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
                >
                    {bannerImages.map((banner, index) => (
                        <div 
                            key={index}
                            className="w-full h-full flex-shrink-0 relative"
                            style={{
                                backgroundImage: `url(${banner.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
                                    <p className="text-xl">{banner.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Banner Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {bannerImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentBannerIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentBannerIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                        />
                    ))}
                </div>
            </section>
            
            {/* Search Bar Section */}
            <section className="bg-white py-6 shadow-md">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for clothing items, brands, categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 text-gray-900 rounded-lg text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rewear-accent focus:border-transparent"
                        />
                        <button 
                            onClick={() => navigateTo('items', { search: searchQuery })}
                            className="absolute right-2 top-2 bg-rewear-primary text-white px-6 py-2 rounded-lg hover:bg-rewear-secondary transition-colors"
                        >
                            🔍 Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Clothing Carousel */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Now</h2>
                        <p className="text-lg text-gray-600">Popular items from our community</p>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : featuredItems.length > 0 ? (
                        <div className="relative">
                            <div className="overflow-x-auto pb-4 hide-scrollbar">
                                <div className="flex space-x-6 px-2">
                                    {featuredItems.map(item => (
                                        <div key={item.id} className="flex-shrink-0 w-64">
                                            <div 
                                                onClick={() => navigateTo('item-detail', item)}
                                                className="bg-white rounded-lg card-shadow hover-lift cursor-pointer overflow-hidden h-full"
                                            >
                                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                                    {item.images && item.images.length > 0 ? (
                                                        <img 
                                                            src={item.images[0]} 
                                                            alt={item.title} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-4xl">👗</span>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-2 capitalize">{item.category} • {item.condition}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-rewear-primary font-bold">{item.points} pts</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                                <button className="bg-white rounded-full shadow-lg p-2 text-gray-600 hover:text-rewear-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </div>
                            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                                <button className="bg-white rounded-full shadow-lg p-2 text-gray-600 hover:text-rewear-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">👗</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No trending items yet!</h3>
                            <p className="text-gray-600 mb-4">Check back soon for the latest additions.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                        <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map(category => (
                            <button
                                key={category.name}
                                onClick={() => navigateTo('items', { category: category.name })}
                                className={`${category.color} p-6 rounded-xl text-center hover:scale-105 transition-transform duration-200`}
                            >
                                <div className="text-4xl mb-2">{category.icon}</div>
                                <div className="font-semibold">{category.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How ReWear Works</h2>
                        <p className="text-lg text-gray-600">Simple steps to start your sustainable fashion journey</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-rewear-light rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📷</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
                            <p className="text-gray-600">Upload photos and details of clothes you no longer wear</p>
                        </div>
                        
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-rewear-light rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔄</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Swap or Redeem</h3>
                            <p className="text-gray-600">Exchange items directly or use points for redemption</p>
                        </div>
                        
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-rewear-light rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🌱</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Help the Planet</h3>
                            <p className="text-gray-600">Reduce textile waste and promote circular fashion</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Items */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Items</h2>
                        <p className="text-lg text-gray-600">Discover amazing clothes from our community</p>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : featuredItems.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredItems.map(item => (
                                <div 
                                    key={item.id}
                                    onClick={() => navigateTo('item-detail', item)}
                                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
                                >
                                    <div className="h-64 bg-gray-200 relative">
                                        {item.images && item.images.length > 0 ? (
                                            <img 
                                                src={item.images[0]} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-5xl">👗</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-rewear-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                                            {item.points} pts
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                            <span className="capitalize text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                {item.condition}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500 capitalize">{item.category} • {item.size}</span>
                                            <button className="bg-rewear-primary text-white px-4 py-2 rounded-lg hover:bg-rewear-secondary transition-colors text-sm">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">👗</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No items yet!</h3>
                            <p className="text-gray-600 mb-6">Be the first to list an item in our community.</p>
                            <button
                                onClick={() => navigateTo(user ? 'add-item' : 'register')}
                                className="bg-rewear-primary text-white px-6 py-3 rounded-lg hover:bg-rewear-secondary transition-colors"
                            >
                                {user ? 'List Your First Item' : 'Join ReWear'}
                            </button>
                        </div>
                    )}
                    
                    <div className="text-center mt-12">
                        <button
                            onClick={() => navigateTo('items')}
                            className="bg-rewear-primary text-white px-8 py-3 rounded-lg hover:bg-rewear-secondary transition-colors"
                        >
                            View All Items
                        </button>
                    </div>
                </div>
            </section>

            {/* Impact Metrics Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
                        <p className="text-lg text-gray-600">Together we're making a difference</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg card-shadow p-8 text-center">
                            <div className="text-5xl mb-4 text-green-500">🌍</div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">2,500+</div>
                            <p className="text-gray-600">Items Exchanged</p>
                        </div>
                        
                        <div className="bg-white rounded-lg card-shadow p-8 text-center">
                            <div className="text-5xl mb-4 text-blue-500">💧</div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">500,000+</div>
                            <p className="text-gray-600">Liters of Water Saved</p>
                        </div>
                        
                        <div className="bg-white rounded-lg card-shadow p-8 text-center">
                            <div className="text-5xl mb-4 text-purple-500">👥</div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">1,200+</div>
                            <p className="text-gray-600">Community Members</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
                        <p className="text-lg text-gray-600">Real experiences from ReWear members</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-rewear-primary rounded-full flex items-center justify-center text-white font-bold">S</div>
                                <div className="ml-4">
                                    <h3 className="font-semibold">Sarah K.</h3>
                                    <div className="text-yellow-500">★★★★★</div>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">"I've found so many unique pieces on ReWear that I couldn't find anywhere else. The community is amazing and I love that I'm helping reduce fashion waste!"</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-rewear-primary rounded-full flex items-center justify-center text-white font-bold">M</div>
                                <div className="ml-4">
                                    <h3 className="font-semibold">Michael T.</h3>
                                    <div className="text-yellow-500">★★★★★</div>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">"As a college student, ReWear has been a game-changer for my wardrobe. I can swap clothes I don't wear anymore for things I actually need without spending money."</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-rewear-primary rounded-full flex items-center justify-center text-white font-bold">J</div>
                                <div className="ml-4">
                                    <h3 className="font-semibold">Jamie L.</h3>
                                    <div className="text-yellow-500">★★★★★</div>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">"I love that I can give my clothes a second life and discover unique pieces at the same time. The points system makes it fun and rewarding!"</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-rewear-dark text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">ReWear</h3>
                        <p className="text-gray-300 mb-4">
                            Building a sustainable future through community-driven fashion exchange
                        </p>
                        <div className="flex justify-center space-x-6">
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Item Card Component
const ItemCard = ({ item, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg card-shadow hover-lift cursor-pointer overflow-hidden"
        >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                {item.images && item.images.length > 0 ? (
                    <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400 text-4xl">👕</span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{item.category}</span>
                    <span className="text-sm font-semibold text-rewear-primary">
                        Size {item.size}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.condition}</span>
                    <span className="text-sm font-semibold text-rewear-secondary">
                        {item.points} points
                    </span>
                </div>
            </div>
        </div>
    );
};