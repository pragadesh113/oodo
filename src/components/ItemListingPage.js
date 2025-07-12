// Item Listing Page Component
const ItemListingPage = ({ navigateTo }) => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSize, setSelectedSize] = useState('all');
    const [selectedCondition, setSelectedCondition] = useState('all');

    const categories = ['all', 'tops', 'bottoms', 'dresses', 'outerwear', 'accessories', 'shoes'];
    const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const conditions = ['all', 'new', 'like new', 'good', 'fair'];

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        filterItems();
    }, [items, searchTerm, selectedCategory, selectedSize, selectedCondition]);

    const fetchItems = async () => {
        try {
            const snapshot = await window.firebaseServices.db
                .collection('items')
                .where('status', '==', 'available')
                .get();

            const itemsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setItems(itemsData);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterItems = () => {
        let filtered = items;

        // Search term filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        // Size filter
        if (selectedSize !== 'all') {
            filtered = filtered.filter(item => item.size === selectedSize);
        }

        // Condition filter
        if (selectedCondition !== 'all') {
            filtered = filtered.filter(item => item.condition === selectedCondition);
        }

        setFilteredItems(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedSize('all');
        setSelectedCondition('all');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation navigateTo={navigateTo} currentPage="items" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
                    <p className="text-gray-600">Discover amazing clothing from our community</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg card-shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search items..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Size
                            </label>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                            >
                                {sizes.map(size => (
                                    <option key={size} value={size}>
                                        {size === 'all' ? 'All Sizes' : size}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Condition Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Condition
                            </label>
                            <select
                                value={selectedCondition}
                                onChange={(e) => setSelectedCondition(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                            >
                                {conditions.map(condition => (
                                    <option key={condition} value={condition}>
                                        {condition === 'all' ? 'All Conditions' : condition.charAt(0).toUpperCase() + condition.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={clearFilters}
                            className="text-rewear-primary hover:text-rewear-secondary transition-colors"
                        >
                            Clear all filters
                        </button>
                        <div className="text-sm text-gray-600">
                            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="loading-spinner"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No items found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search or filters
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-rewear-primary text-white px-4 py-2 rounded-lg hover:bg-rewear-secondary transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map(item => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onClick={() => navigateTo('item-detail', item)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};