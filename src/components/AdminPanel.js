// Admin Panel Component
const AdminPanel = ({ navigateTo }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('items');
    const [pendingItems, setPendingItems] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [swapRequests, setSwapRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user) {
            checkAdminStatus();
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
                fetchAdminData();
            } else {
                navigateTo('dashboard');
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            navigateTo('dashboard');
        }
    };

    const fetchAdminData = async () => {
        try {
            // Fetch all items
            const itemsSnapshot = await window.firebaseServices.db
                .collection('items')
                .orderBy('createdAt', 'desc')
                .get();
            
            const items = itemsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setAllItems(items);
            setPendingItems(items.filter(item => item.status === 'pending'));

            // Fetch all users
            const usersSnapshot = await window.firebaseServices.db
                .collection('users')
                .get();
            
            const users = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setAllUsers(users);

            // Fetch swap requests
            const swapsSnapshot = await window.firebaseServices.db
                .collection('swaps')
                .orderBy('date', 'desc')
                .get();
            
            const swaps = swapsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setSwapRequests(swaps);

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleItemAction = async (itemId, action) => {
        try {
            const updateData = {
                status: action,
                reviewedAt: new Date(),
                reviewedBy: user.uid
            };

            if (action === 'rejected') {
                updateData.status = 'rejected';
            } else if (action === 'approved') {
                updateData.status = 'available';
            }

            await window.firebaseServices.db
                .collection('items')
                .doc(itemId)
                .update(updateData);

            // Refresh data
            fetchAdminData();

        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item status');
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await window.firebaseServices.db
                    .collection('items')
                    .doc(itemId)
                    .delete();

                fetchAdminData();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Error deleting item');
            }
        }
    };

    const toggleUserAdminStatus = async (userId, currentStatus) => {
        try {
            await window.firebaseServices.db
                .collection('users')
                .doc(userId)
                .update({
                    isAdmin: !currentStatus
                });

            fetchAdminData();
        } catch (error) {
            console.error('Error updating user admin status:', error);
            alert('Error updating user status');
        }
    };

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation navigateTo={navigateTo} currentPage="admin" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                    <p className="text-gray-600">Manage ReWear platform content and users</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg card-shadow p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">{allItems.length}</div>
                                <div className="text-sm text-gray-600">Total Items</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg card-shadow p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">{pendingItems.length}</div>
                                <div className="text-sm text-gray-600">Pending Review</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg card-shadow p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">{allUsers.length}</div>
                                <div className="text-sm text-gray-600">Total Users</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg card-shadow p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🔄</span>
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">{swapRequests.length}</div>
                                <div className="text-sm text-gray-600">Swap Requests</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg card-shadow">
                    <div className="border-b border-gray-200">
                        <div className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('items')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'items'
                                        ? 'border-rewear-primary text-rewear-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Item Management
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'users'
                                        ? 'border-rewear-primary text-rewear-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                User Management
                            </button>
                            <button
                                onClick={() => setActiveTab('swaps')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'swaps'
                                        ? 'border-rewear-primary text-rewear-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Swap Requests
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        {/* Item Management */}
                        {activeTab === 'items' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Item Management</h2>
                                
                                {pendingItems.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-medium mb-4 text-yellow-600">
                                            Pending Review ({pendingItems.length})
                                        </h3>
                                        <div className="space-y-4">
                                            {pendingItems.map(item => (
                                                <div key={item.id} className="border rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                {item.images && item.images[0] ? (
                                                                    <img
                                                                        src={item.images[0]}
                                                                        alt={item.title}
                                                                        className="w-full h-full object-cover rounded-lg"
                                                                    />
                                                                ) : (
                                                                    <span className="text-gray-400">👕</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium">{item.title}</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    {item.category} • {item.size} • {item.condition}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    By: {item.userName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleItemAction(item.id, 'approved')}
                                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleItemAction(item.id, 'rejected')}
                                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-medium mb-4">All Items</h3>
                                    <div className="space-y-4">
                                        {allItems.map(item => (
                                            <div key={item.id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                            {item.images && item.images[0] ? (
                                                                <img
                                                                    src={item.images[0]}
                                                                    alt={item.title}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-400">👕</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">{item.title}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {item.category} • {item.size} • {item.condition}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Status: <span className={`font-medium ${
                                                                    item.status === 'available' ? 'text-green-600' :
                                                                    item.status === 'pending' ? 'text-yellow-600' :
                                                                    item.status === 'rejected' ? 'text-red-600' :
                                                                    'text-gray-600'
                                                                }`}>
                                                                    {item.status}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Management */}
                        {activeTab === 'users' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">User Management</h2>
                                <div className="space-y-4">
                                    {allUsers.map(userData => (
                                        <div key={userData.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium">{userData.username}</h4>
                                                    <p className="text-sm text-gray-600">{userData.email}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Points: {userData.points} • 
                                                        Joined: {userData.joinDate?.toDate?.().toLocaleDateString() || 'Recently'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded text-sm ${
                                                        userData.isAdmin 
                                                            ? 'bg-purple-100 text-purple-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {userData.isAdmin ? 'Admin' : 'User'}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleUserAdminStatus(userData.id, userData.isAdmin)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                                    >
                                                        {userData.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Swap Requests */}
                        {activeTab === 'swaps' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Swap Requests</h2>
                                <div className="space-y-4">
                                    {swapRequests.map(swap => (
                                        <div key={swap.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium">{swap.itemTitle}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Type: {swap.type} • Status: {swap.status}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        User: {swap.userName} • 
                                                        Date: {swap.date?.toDate?.().toLocaleDateString()}
                                                    </p>
                                                    {swap.points && (
                                                        <p className="text-sm text-gray-600">
                                                            Points: {swap.points}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={`px-2 py-1 rounded text-sm ${
                                                    swap.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {swap.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};