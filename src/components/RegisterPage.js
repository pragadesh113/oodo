// Registration Page Component
const RegisterPage = ({ navigateTo, goBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const { register } = useAuth();

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicturePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getErrorMessage = (error) => {
        // Log the actual error for debugging
        console.error('Firebase registration error:', error.code, error.message);
        
        // Return user-friendly messages
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters long.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            case 'auth/invalid-credential':
                return 'Invalid credentials. Please try again.';
            default:
                return 'Failed to create account. Please try again.';
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword || !username) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password should be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await register(email, password, username);
            // TODO: Upload profile picture if selected
            navigateTo('dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            setError(getErrorMessage(error));
            
            // Log the error for debugging but don't show technical details to users
            if (process.env.NODE_ENV === 'development') {
                console.log('Detailed error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Back Button */}
                <div className="flex justify-start mb-4">
                    <button
                        onClick={goBack}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <span className="mr-2">←</span>
                        Back
                    </button>
                </div>
                
                <div>
                    <div className="flex justify-center">
                        <button
                            onClick={() => navigateTo('landing')}
                            className="flex items-center space-x-2 text-rewear-primary font-bold text-2xl hover:text-rewear-secondary transition-colors"
                        >
                            <span className="text-3xl">👗</span>
                            <span>ReWear</span>
                        </button>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Join ReWear Community
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create your account and start your sustainable fashion journey
                    </p>
                </div>
                
                <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                    <div className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        
                        {/* Profile Picture Upload */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-300">
                                    {profilePicturePreview ? (
                                        <img 
                                            src={profilePicturePreview} 
                                            alt="Profile preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-3xl">👤</span>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-rewear-primary text-white p-2 rounded-full cursor-pointer hover:bg-rewear-secondary transition-colors">
                                    <span className="text-sm">📷</span>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                        
                        {/* Social Login Options */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <span className="mr-2">🔗</span>
                                Sign up with Google
                            </button>
                            <button
                                type="button"
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                <span className="mr-2">📘</span>
                                Sign up with Facebook
                            </button>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                placeholder="Choose a username"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full bg-rewear-primary text-white py-2 px-4 rounded-lg hover:bg-rewear-secondary focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <div className="loading-spinner mr-2"></div>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                        
                        <div className="text-center">
                            <button
                                onClick={() => navigateTo('login')}
                                className="text-rewear-primary hover:text-rewear-secondary transition-colors"
                            >
                                Already have an account? Sign in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};