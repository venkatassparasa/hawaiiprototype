import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Default login if no button clicked
        submitRole('Enforcement Officer', 'Jane Doe');
    };

    const validateCredentials = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!password.trim()) {
            setError('Password is required');
            return false;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }
        setError('');
        return true;
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError(''); // Clear error when user starts typing
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError(''); // Clear error when user starts typing
    };

    const submitRole = (role, name) => {
        // Validate credentials for Finance, Legal, and Planning departments
        if (['Finance', 'Legal', 'Planning'].includes(role)) {
            if (!validateCredentials()) {
                return;
            }
        }

        // For Public View, don't create a user session - just set role for navigation
        if (role === 'Public') {
            onLogin({
                name: null, // No name for public users
                email: null, // No email for public users
                role: role,
                avatar: null // No avatar for public users
            });
            navigate('/dashboard');
        } else {
            // For all other roles, check email domain for RBAC
            const userEmail = email || '';
            let userRole = role;
            let userName = name;

            // Determine role based on exact email domain match
            if (userEmail.toLowerCase() === 'admin@hawaiicounty.gov') {
                userRole = 'Admin';
                userName = 'System Administrator';
            } else if (userEmail.toLowerCase() === 'finance@hawaiicounty.gov') {
                userRole = 'Finance';
                userName = 'Finance Director';
            } else if (userEmail.toLowerCase() === 'legal@hawaiicounty.gov') {
                userRole = 'Legal';
                userName = 'County Attorney';
            } else if (userEmail.toLowerCase() === 'planning@hawaiicounty.gov') {
                userRole = 'Planning';
                userName = 'Planning Director';
            } else if (userEmail.toLowerCase() === 'enforcement@hawaiicounty.gov') {
                userRole = 'Enforcement';
                userName = 'Enforcement Officer';
            }

            // Create full user session
            onLogin({
                name: userName,
                email: userEmail || `${userName.toLowerCase().replace(' ', '.')}@hawaiicounty.gov`,
                role: userRole,
                avatar: userName ? userName.split(' ').map(n => n[0]).join('') : ''
            });
            navigate('/dashboard');
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-white relative overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white-900/70 via-white-800/50 to-emerald-900/60"></div>

            {/* Split Layout */}
            <div className="relative z-10 flex w-full h-full">
                {/* Left Side - Image */}
                <div className="hidden lg:flex lg:w-3/5 relative items-center justify-center p-8">
                    <div className="relative w-full h-[80vh] max-w-[600px] rounded-2xl overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
                        <img
                            src="/login-bg.png"
                            alt="County of Hawaii"
                            className="w-full h-full object-cover opacity-100 mix-blend-normal brightness-125 contrast-110 saturate-120"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-emerald-400/20"></div>
                        {/* Logo overlay at top-left of beach image */}
                        <div className="absolute top-4 left-4 z-10">
                            <img
                                src="/h_logo.png"
                                alt="County of Hawaii Planning Department"
                                className="w-auto max-w-[200px] h-auto object-contain filter brightness-110"
                            />
                        </div>
                        {/* Title overlay at top-right of beach image */}
                        <div className="absolute top-4 right-4 z-10 text-right">
                            <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-md"
                                style={{ font: 'normal normal normal 27px/28px Helvetica Neue' }}>Compliance Portal</h1>
                            {/*<p className="text-white/80 text-sm font-medium drop-shadow-md">County of Hawaii</p>*/}
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Card */}
                <div className="flex-1 lg:flex-none lg:w-2/5 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 space-y-4 border border-white/20">

                            {/* Email and Password Fields */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Error Display */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            placeholder="your.name@hawaiicounty.gov"
                                            className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 transition-all ${error && !email.trim()
                                                ? 'border-red-300 focus:border-red-500'
                                                : 'border-slate-200 focus:border-hawaii-ocean'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter your password"
                                            className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 transition-all ${error && !password.trim()
                                                ? 'border-red-300 focus:border-red-500'
                                                : 'border-slate-200 focus:border-hawaii-ocean'
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember & Forgot */}
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-hawaii-ocean focus:ring-hawaii-ocean/20" />
                                        <span className="text-slate-600">Remember me</span>
                                    </label>
                                    <a href="#" className="text-hawaii-ocean hover:underline font-medium">Forgot password?</a>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-hawaii-ocean text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl"
                                    style={{ background: '#4D7833 0% 0% no-repeat padding-box' }}
                                >
                                    Sign In
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
                                <p>Authorized personnel only. Unauthorized access is prohibited.</p>
                                <div className="mt-3 space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onLogin({
                                                name: null,
                                                email: null,
                                                role: 'Public',
                                                avatar: null
                                            });
                                            navigate('/dashboard');
                                        }}
                                        className="text-hawaii-ocean hover:underline font-medium"
                                    >
                                        Continue as Public/Guest
                                    </button>
                                    <br />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate('/hosting-registration');
                                        }}
                                        className="text-hawaii-ocean hover:underline font-medium"
                                    >
                                        Hosting Platform Registration
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-hawaii-coral rounded-full opacity-20 blur-2xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
