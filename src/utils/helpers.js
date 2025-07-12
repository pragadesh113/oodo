// Utility Helper Functions
const Utils = {
    // Format date for display
    formatDate(date) {
        if (!date) return 'Recently';
        
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format relative time (e.g., "2 days ago")
    formatRelativeTime(date) {
        if (!date) return 'Recently';
        
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        const now = new Date();
        const diffInMs = now - dateObj;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Debounce function for search
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Truncate text with ellipsis
    truncateText(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // Calculate points for an item
    calculateItemPoints(itemData) {
        let points = 10; // Base points
        
        // Condition bonus
        switch (itemData.condition) {
            case 'new':
                points += 5;
                break;
            case 'like new':
                points += 3;
                break;
            case 'good':
                points += 1;
                break;
            default:
                break;
        }
        
        // Category bonus
        if (itemData.category === 'outerwear' || itemData.category === 'dresses') {
            points += 2;
        }
        
        // Size penalty for very small or very large sizes
        if (itemData.size === 'XS' || itemData.size === 'XXL') {
            points -= 1;
        }
        
        return Math.max(points, 5); // Minimum 5 points
    },

    // Format points display
    formatPoints(points) {
        if (points === 1) return '1 point';
        return `${points} points`;
    },

    // Get status color class
    getStatusColor(status) {
        switch (status) {
            case 'available':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'redeemed':
                return 'text-blue-600 bg-blue-100';
            case 'rejected':
                return 'text-red-600 bg-red-100';
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'cancelled':
                return 'text-gray-600 bg-gray-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    },

    // Get condition color class
    getConditionColor(condition) {
        switch (condition) {
            case 'new':
                return 'text-green-600 bg-green-100';
            case 'like new':
                return 'text-blue-600 bg-blue-100';
            case 'good':
                return 'text-yellow-600 bg-yellow-100';
            case 'fair':
                return 'text-orange-600 bg-orange-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    },

    // Capitalize first letter
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Convert to title case
    toTitleCase(str) {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Check if image file
    isImageFile(file) {
        return file && file.type.startsWith('image/');
    },

    // Generate slug from title
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    },

    // Local storage helpers
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    getLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },

    // URL helpers
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    setQueryParam(param, value) {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.pushState(null, '', url.toString());
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    },

    // Show notification (if browser supports)
    showNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            return new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        }
    },

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }
};

// Make Utils available globally
window.Utils = Utils;