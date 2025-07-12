// Add Item Page Component
const AddItemPage = ({ navigateTo }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        type: '',
        size: '',
        condition: '',
        tags: ''
    });
    const [images, setImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ['tops', 'bottoms', 'dresses', 'outerwear', 'accessories', 'shoes'];
    const types = {
        tops: ['shirt', 't-shirt', 'blouse', 'sweater', 'hoodie'],
        bottoms: ['jeans', 'pants', 'shorts', 'skirt', 'leggings'],
        dresses: ['casual dress', 'formal dress', 'maxi dress', 'mini dress'],
        outerwear: ['jacket', 'coat', 'blazer', 'cardigan'],
        accessories: ['bag', 'belt', 'scarf', 'jewelry', 'hat'],
        shoes: ['sneakers', 'boots', 'heels', 'flats', 'sandals']
    };
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const conditions = ['new', 'like new', 'good', 'fair'];

    useEffect(() => {
        if (!user) {
            navigateTo('login');
        }
    }, [user]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Reset type when category changes
        if (field === 'category') {
            setFormData(prev => ({
                ...prev,
                type: ''
            }));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + images.length > 5) {
            setError('You can upload maximum 5 images');
            return;
        }

        // Create preview URLs
        const newImageUrls = files.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...files]);
        setImageUrls(prev => [...prev, ...newImageUrls]);
        setError('');
    };

    const removeImage = (index) => {
        // Revoke the URL to free memory
        URL.revokeObjectURL(imageUrls[index]);
        
        setImages(prev => prev.filter((_, i) => i !== index));
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
        if (images.length === 0) return [];

        const uploadPromises = images.map(async (image, index) => {
            const fileName = `items/${user.uid}/${Date.now()}_${index}`;
            const storageRef = window.firebaseServices.storage.ref(fileName);
            
            const snapshot = await storageRef.put(image);
            return await snapshot.ref.getDownloadURL();
        });

        return await Promise.all(uploadPromises);
    };

    const calculatePoints = () => {
        // Base points calculation
        let points = 10; // Base points
        
        if (formData.condition === 'new') points += 5;
        if (formData.condition === 'like new') points += 3;
        if (formData.category === 'outerwear' || formData.category === 'dresses') points += 2;
        
        return points;
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.title || !formData.description || !formData.category || 
            !formData.type || !formData.size || !formData.condition) {
            setError('Please fill in all required fields');
            return;
        }

        if (images.length === 0) {
            setError('Please upload at least one image');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Upload images
            const uploadedImageUrls = await uploadImages();

            // Parse tags
            const tagsArray = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            // Create item document
            const itemData = {
                ...formData,
                images: uploadedImageUrls,
                tags: tagsArray,
                points: calculatePoints(),
                userId: user.uid,
                userName: user.displayName || user.email,
                status: 'available',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const docRef = await window.firebaseServices.db.collection('items').add(itemData);

            // Award points to user for listing an item
            const userRef = window.firebaseServices.db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
                const currentPoints = userDoc.data().points || 0;
                await userRef.update({
                    points: currentPoints + 5 // Bonus points for listing
                });
            }

            // Clean up image URLs
            imageUrls.forEach(url => URL.revokeObjectURL(url));

            alert('Item listed successfully!');
            navigateTo('dashboard');

        } catch (error) {
            console.error('Error adding item:', error);
            setError('Error listing item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation navigateTo={navigateTo} currentPage="add-item" />
            
            <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg card-shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">List New Item</h1>
                        <p className="text-gray-600 mt-1">
                            Share your clothing with the ReWear community
                        </p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Images Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Images *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                <div className="text-center">
                                    <span className="text-4xl mb-4 block">📷</span>
                                    <div className="text-sm text-gray-600 mb-4">
                                        Upload up to 5 images of your item
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="bg-rewear-primary text-white px-4 py-2 rounded-lg hover:bg-rewear-secondary transition-colors cursor-pointer"
                                    >
                                        Choose Images
                                    </label>
                                </div>
                            </div>
                            
                            {imageUrls.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                placeholder="e.g., Blue Denim Jacket"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                placeholder="Describe your item in detail..."
                            />
                        </div>

                        {/* Category and Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                    disabled={!formData.category}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent disabled:bg-gray-100"
                                >
                                    <option value="">Select type</option>
                                    {formData.category && types[formData.category]?.map(type => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Size and Condition */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Size *
                                </label>
                                <select
                                    value={formData.size}
                                    onChange={(e) => handleInputChange('size', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                >
                                    <option value="">Select size</option>
                                    {sizes.map(size => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Condition *
                                </label>
                                <select
                                    value={formData.condition}
                                    onChange={(e) => handleInputChange('condition', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                >
                                    <option value="">Select condition</option>
                                    {conditions.map(condition => (
                                        <option key={condition} value={condition}>
                                            {condition.charAt(0).toUpperCase() + condition.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => handleInputChange('tags', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                placeholder="e.g., casual, vintage, summer (comma separated)"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Add tags to help others find your item
                            </p>
                        </div>

                        {/* Points Preview */}
                        <div className="bg-rewear-light p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-rewear-dark font-medium">
                                    Estimated Points Value:
                                </span>
                                <span className="text-2xl font-bold text-rewear-primary">
                                    {calculatePoints()} points
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                You'll earn 5 bonus points for listing this item!
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigateTo('dashboard')}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 bg-rewear-primary text-white py-3 px-4 rounded-lg hover:bg-rewear-secondary focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <div className="loading-spinner mr-2"></div>
                                        Listing Item...
                                    </span>
                                ) : (
                                    'List Item'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};