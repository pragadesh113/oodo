// Dashboard Page Component
const DashboardPage = ({ navigateTo }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('listings');
    const [userProfile, setUserProfile] = useState(null);
    const [userItems, setUserItems] = useState([]);
    const [userSwaps, setUserSwaps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            // Fetch user profile
            const userDoc = await window.firebaseServices.db
                .collection('users')
                .doc(user.uid)
                .get();
            
            if (userDoc.exists) {
                setUserProfile(userDoc.data());
            }

            // Fetch user items
            const itemsSnapshot = await window.firebaseServices.db
                .collection('items')
                .where('userId', '==', user.uid)
                .get();

            const items = itemsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUserItems(items);

            // Fetch user swaps
            const swapsSnapshot = await window.firebaseServices.db
                .collection('swaps')
                .where('userId', '==', user.uid)
                .get();

            const swaps = swapsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUserSwaps(swaps);

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation navigateTo={navigateTo} currentPage="dashboard" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-lg card-shadow mb-6">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-rewear-primary rounded-full flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">
                                        {(user.displayName || user.email)[0].toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {user.displayName || 'Welcome!'}
                                    </h1>
                                    <p className="text-gray-600">{user.email}</p>
                                    <p className="text-sm text-gray-500">
                                        Member since {userProfile?.joinDate ? 
                                            new Date(userProfile.joinDate.toDate()).toLocaleDateString() : 
                                            'Recently'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-rewear-primary">
                                    {userProfile?.points || 0}
                                </div>
                                <div className="text-sm text-gray-600">Points</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg card-shadow p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">{userItems.length}</div>
                                <div className="text-sm text-gray-600">Items Listed</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg card-shadow p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🔄</span>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">{userSwaps.length}</div>
                                <div className="text-sm text-gray-600">Swaps Made</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg card-shadow p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">
                                    {userItems.filter(item => item.status === 'available').length}
                                </div>
                                <div className="text-sm text-gray-600">Available Items</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg card-shadow">
                    <div className="border-b border-gray-200">
                        <div className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('listings')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'listings'
                                        ? 'border-rewear-primary text-rewear-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                My Listings
                            </button>
                            <button
                                onClick={() => setActiveTab('swaps')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'swaps'
                                        ? 'border-rewear-primary text-rewear-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                My Swaps
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        {activeTab === 'listings' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">My Listings</h2>
                                    <button
                                        onClick={() => navigateTo('add-item')}
                                        className="bg-rewear-primary text-white px-4 py-2 rounded-lg hover:bg-rewear-secondary transition-colors"
                                    >
                                        Add New Item
                                    </button>
                                </div>
                                
                                {userItems.length === 0 ? (
                                    <div className="text-center py-8">
                                        <span className="text-6xl mb-4 block">👗</span>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No items listed yet
                                        </h3>
                                        <p className="text-gray-600">
                                            Start by adding your first item to the community
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {userItems.map(item => (
                                            <ItemCard
                                                key={item.id}
                                                item={item}
                                                onClick={() => navigateTo('item-detail', item)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'swaps' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">My Swaps</h2>
                                
                                {userSwaps.length === 0 ? (
                                    <div className="text-center py-8">
                                        <span className="text-6xl mb-4 block">🔄</span>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No swaps yet
                                        </h3>
                                        <p className="text-gray-600">
                                            Browse items and start swapping!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {userSwaps.map(swap => (
                                            <div key={swap.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-medium">{swap.itemTitle}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            Status: {swap.status}
                                                        </p>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {swap.date?.toDate().toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};