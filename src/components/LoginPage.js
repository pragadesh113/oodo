// Login Page Component
const LoginPage = ({ navigateTo, goBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState('');
    const { login } = useAuth();

    const getErrorMessage = (error) => {
        // Log the actual error for debugging
        console.error('Firebase auth error:', error.code, error.message);
        
        // Return user-friendly messages
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-email':
            case 'auth/invalid-credential':
                return 'Incorrect email or password. Please try again.';
            case 'auth/user-disabled':
                return 'This account has been disabled. Please contact support.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            default:
                return 'Incorrect email or password. Please try again.';
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigateTo('dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!resetEmail) {
            setError('Please enter your email address');
            return;
        }

        setResetLoading(true);
        setError('');
        setResetMessage('');

        try {
            await window.firebaseServices.auth.sendPasswordResetEmail(resetEmail);
            setResetMessage('Password reset email sent! Check your inbox.');
            setTimeout(() => {
                setShowForgotPassword(false);
                setResetEmail('');
                setResetMessage('');
            }, 3000);
        } catch (error) {
            console.error('Password reset error:', error.code, error.message);
            
            // Simplified user-friendly error message
            if (error.code === 'auth/user-not-found') {
                setError('No account found with this email address.');
            } else if (error.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError('Unable to send reset email. Please try again later.');
            }
        } finally {
            setResetLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
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
                        Welcome back!
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to your account to continue swapping
                    </p>
                </div>
                
                <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                    <div className="space-y-6">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
                                <div className="flex items-center">
                                    <span className="text-xl mr-2">⚠️</span>
                                    <span className="font-medium">{error}</span>
                                </div>
                            </div>
                        )}
                        
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
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                    placeholder="Enter your password"
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
                        
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-rewear-primary text-white py-2 px-4 rounded-lg hover:bg-rewear-secondary focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <div className="loading-spinner mr-2"></div>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                        
                        <div className="text-center space-y-2">
                            <button
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm text-rewear-primary hover:text-rewear-secondary transition-colors"
                            >
                                Forgot your password?
                            </button>
                            <div>
                                <button
                                    onClick={() => navigateTo('register')}
                                    className="text-rewear-primary hover:text-rewear-secondary transition-colors"
                                >
                                    Don't have an account? Sign up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
                        
                        {resetMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                                {resetMessage}
                            </div>
                        )}
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setResetEmail('');
                                    setError('');
                                    setResetMessage('');
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleForgotPassword}
                                disabled={resetLoading}
                                className="flex-1 bg-rewear-primary text-white px-4 py-2 rounded-lg hover:bg-rewear-secondary disabled:opacity-50 transition-colors"
                            >
                                {resetLoading ? 'Sending...' : 'Send Reset Email'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};