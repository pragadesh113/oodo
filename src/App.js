// Main App Component
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
        setCurrentPage(page);
        if (data) {
            setSelectedItem(data);
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
        switch (currentPage) {
            case 'landing':
                return <LandingPage navigateTo={navigateTo} />;
            case 'login':
                return <LoginPage navigateTo={navigateTo} />;
            case 'register':
                return <RegisterPage navigateTo={navigateTo} />;
            case 'dashboard':
                return <DashboardPage navigateTo={navigateTo} />;
            case 'items':
                return <ItemListingPage navigateTo={navigateTo} />;
            case 'item-detail':
                return <ItemDetailPage item={selectedItem} navigateTo={navigateTo} />;
            case 'add-item':
                return <AddItemPage navigateTo={navigateTo} />;
            case 'admin':
                return <AdminPanel navigateTo={navigateTo} />;
            default:
                return <LandingPage navigateTo={navigateTo} />;
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
                            className={`text-gray-700 hover:text-rewear-primary transition-colors ${
                                currentPage === 'items' ? 'text-rewear-primary font-semibold' : ''
                            }`}
                        >
                            Browse Items
                        </button>
                        
                        {user ? (
                            <>
                                <button
                                    onClick={() => navigateTo('dashboard')}
                                    className={`text-gray-700 hover:text-rewear-primary transition-colors ${
                                        currentPage === 'dashboard' ? 'text-rewear-primary font-semibold' : ''
                                    }`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => navigateTo('add-item')}
                                    className="bg-rewear-primary text-white px-4 py-2 rounded-lg hover:bg-rewear-secondary transition-colors"
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
const LandingPage = ({ navigateTo }) => {
    const { user } = useAuth();
    const [featuredItems, setFeaturedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedItems();
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
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Items</h2>
                        <p className="text-lg text-gray-600">Discover amazing clothes from our community</p>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredItems.map(item => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    onClick={() => navigateTo('item-detail', item)}
                                />
                            ))}
                        </div>
                    )}
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