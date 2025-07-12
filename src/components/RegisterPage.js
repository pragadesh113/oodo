// Registration Page Component
const RegisterPage = ({ navigateTo }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();

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
            navigateTo('dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
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
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                placeholder="Create a password"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rewear-primary focus:border-transparent"
                                placeholder="Confirm your password"
                            />
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