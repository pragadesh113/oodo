// Item Detail Page Component
const ItemDetailPage = ({ item, navigateTo }) => {
    const { user } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [uploaderInfo, setUploaderInfo] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [swapLoading, setSwapLoading] = useState(false);

    useEffect(() => {
        if (item) {
            fetchUploaderInfo();
        }
        if (user) {
            fetchUserProfile();
        }
    }, [item, user]);

    const fetchUploaderInfo = async () => {
        try {
            const userDoc = await window.firebaseServices.db
                .collection('users')
                .doc(item.userId)
                .get();
            
            if (userDoc.exists) {
                setUploaderInfo(userDoc.data());
            }
        } catch (error) {
            console.error('Error fetching uploader info:', error);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const userDoc = await window.firebaseServices.db
                .collection('users')
                .doc(user.uid)
                .get();
            
            if (userDoc.exists) {
                setUserProfile(userDoc.data());
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleSwapRequest = async () => {
        if (!user) {
            navigateTo('login');
            return;
        }

        if (user.uid === item.userId) {
            alert('You cannot swap with your own item');
            return;
        }

        setSwapLoading(true);
        try {
            // Create swap request
            await window.firebaseServices.db.collection('swaps').add({
                itemId: item.id,
                itemTitle: item.title,
                ownerId: item.userId,
                userId: user.uid,
                userName: user.displayName || user.email,
                status: 'pending',
                type: 'swap',
                date: new Date(),
                message: `${user.displayName || user.email} wants to swap for ${item.title}`
            });

            alert('Swap request sent successfully!');
        } catch (error) {
            console.error('Error creating swap request:', error);
            alert('Error sending swap request. Please try again.');
        } finally {
            setSwapLoading(false);
        }
    };

    const handlePointsRedemption = async () => {
        if (!user) {
            navigateTo('login');
            return;
        }

        if (user.uid === item.userId) {
            alert('You cannot redeem your own item');
            return;
        }

        if (!userProfile || userProfile.points < item.points) {
            alert(`You need ${item.points} points to redeem this item. You currently have ${userProfile?.points || 0} points.`);
            return;
        }

        setLoading(true);
        try {
            // Create redemption transaction
            await window.firebaseServices.db.collection('swaps').add({
                itemId: item.id,
                itemTitle: item.title,
                ownerId: item.userId,
                userId: user.uid,
                userName: user.displayName || user.email,
                status: 'completed',
                type: 'points',
                points: item.points,
                date: new Date(),
                message: `${user.displayName || user.email} redeemed ${item.title} for ${item.points} points`
            });

            // Update user points
            await window.firebaseServices.db.collection('users').doc(user.uid).update({
                points: userProfile.points - item.points
            });

            // Update item status
            await window.firebaseServices.db.collection('items').doc(item.id).update({
                status: 'redeemed',
                redeemedBy: user.uid,
                redeemedDate: new Date()
            });

            alert('Item redeemed successfully!');
            navigateTo('dashboard');
        } catch (error) {
            console.error('Error redeeming item:', error);
            alert('Error redeeming item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
                    <button
                        onClick={() => navigateTo('items')}
                        className="bg-rewear-primary text-white px-4 py-2 rounded-lg hover:bg-rewear-secondary transition-colors"
                    >
                        Browse Items
                    </button>
                </div>
            </div>
        );
    }

    const images = item.images || [];
    const hasImages = images.length > 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation navigateTo={navigateTo} currentPage="item-detail" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigateTo('items')}
                    className="flex items-center text-rewear-primary hover:text-rewear-secondary transition-colors mb-6"
                >
                    <span className="mr-2">←</span>
                    Back to Browse
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            {hasImages ? (
                                <img
                                    src={images[currentImageIndex]}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-400 text-6xl">👕</span>
                                </div>
                            )}
                        </div>
                        
                        {hasImages && images.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                            index === currentImageIndex
                                                ? 'border-rewear-primary'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${item.title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Item Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="bg-gray-100 px-3 py-1 rounded-full">
                                    {item.category}
                                </span>
                                <span className="bg-gray-100 px-3 py-1 rounded-full">
                                    Size {item.size}
                                </span>
                                <span className="bg-gray-100 px-3 py-1 rounded-full">
                                    {item.condition}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-700">{item.description}</p>
                        </div>

                        {item.tags && item.tags.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-rewear-light text-rewear-primary px-3 py-1 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Uploader Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-2">Listed by</h3>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-rewear-primary rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                        {(uploaderInfo?.username || 'U')[0].toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-medium">{uploaderInfo?.username || 'Anonymous'}</div>
                                    <div className="text-sm text-gray-600">
                                        Member since {uploaderInfo?.joinDate ? 
                                            new Date(uploaderInfo.joinDate.toDate()).toLocaleDateString() : 
                                            'Recently'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Points and Status */}
                        <div className="bg-white rounded-lg p-4 border">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="text-2xl font-bold text-rewear-primary">
                                        {item.points} Points
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Status: {item.status}
                                    </div>
                                </div>
                                {userProfile && (
                                    <div className="text-right">
                                        <div className="text-lg font-semibold">
                                            Your Points: {userProfile.points}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {item.status === 'available' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleSwapRequest}
                                        disabled={swapLoading || !user || user.uid === item.userId}
                                        className="w-full bg-rewear-primary text-white py-3 px-4 rounded-lg hover:bg-rewear-secondary focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {swapLoading ? (
                                            <span className="flex items-center justify-center">
                                                <div className="loading-spinner mr-2"></div>
                                                Sending Request...
                                            </span>
                                        ) : (
                                            'Request Swap'
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={handlePointsRedemption}
                                        disabled={loading || !user || user.uid === item.userId || 
                                                 !userProfile || userProfile.points < item.points}
                                        className="w-full bg-rewear-secondary text-white py-3 px-4 rounded-lg hover:bg-rewear-primary focus:outline-none focus:ring-2 focus:ring-rewear-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <div className="loading-spinner mr-2"></div>
                                                Redeeming...
                                            </span>
                                        ) : (
                                            `Redeem with Points (${item.points})`
                                        )}
                                    </button>
                                </div>
                            )}

                            {item.status !== 'available' && (
                                <div className="text-center py-4">
                                    <span className="text-gray-600">
                                        This item is no longer available
                                    </span>
                                </div>
                            )}

                            {!user && (
                                <div className="text-center py-4">
                                    <button
                                        onClick={() => navigateTo('login')}
                                        className="text-rewear-primary hover:text-rewear-secondary transition-colors"
                                    >
                                        Login to swap or redeem this item
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};