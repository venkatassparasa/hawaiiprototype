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
            // For all other roles, create full user session
            onLogin({
                name: name,
                email: email || `${name.toLowerCase().replace(' ', '.')}@hawaiicounty.gov`,
                role: role,
                avatar: name.split(' ').map(n => n[0]).join('')
            });
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: 'url("/bg-login.jpg")', filter: `brightness(1.1)` }}>
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-4 space-y-3">

                    {/* Header */}
                    <div className="text-center space-y-">
                        <div className="flex justify-center">
                            <div className="w-full max-w-[280px] px-2 py-4 bg-white/5 rounded-xl border border-slate-100/50">
                                <img
                                    src="/logo.png"
                                    alt="County of Hawaii Planning Department"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Compliance Portal</h1>
                            <p className="text-slate-500 text-sm font-medium">County of Hawaii</p>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Sign in as Department</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => submitRole('Finance', 'Finance Director')}
                                className="flex flex-col items-center justify-center p-4 border border-slate-300 rounded-xl hover:border-hawaii-ocean hover:bg-slate-50 transition-all text-center"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-600 bg-opacity-20 flex items-center justify-center text-hawaii-ocean font-bold mb-2 text-lg">F</div>
                                <p className="font-bold text-slate-800 text-sm">Finance</p>
                            </button>

                            <button
                                onClick={() => submitRole('Planning', 'Planning Director')}
                                className="flex flex-col items-center justify-center p-4 border border-slate-300 rounded-xl hover:border-hawaii-ocean hover:bg-slate-50 transition-all text-center"
                            >
                                <div className="w-10 h-10 rounded-full bg-hawaii-coral bg-opacity-30 flex items-center justify-center text-hawaii-coral font-bold mb-2 text-lg">P</div>
                                <p className="font-bold text-slate-800 text-sm">Planning</p>
                            </button>

                            <button
                                onClick={() => submitRole('Legal', 'County Attorney')}
                                className="flex flex-col items-center justify-center p-4 border border-slate-300 rounded-xl hover:border-hawaii-ocean hover:bg-slate-50 transition-all text-center"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-400 bg-opacity-30 flex items-center justify-center text-slate-500 font-bold mb-2 text-lg">L</div>
                                <p className="font-bold text-slate-800 text-sm">Legal</p>
                            </button>

                            <button
                                onClick={() => submitRole('Public', 'Resident / Visitor')}
                                className="flex flex-col items-center justify-center p-4 border border-slate-300 rounded-xl hover:border-hawaii-ocean hover:bg-slate-50 transition-all text-center"
                            >
                                <div className="w-10 h-10 rounded-full bg-green-400 bg-opacity-20 flex items-center justify-center text-green-600 font-bold mb-2 text-lg">V</div>
                                <p className="font-bold text-slate-800 text-sm">Public View</p>
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-slate-400 capitalize">Or standard login</span></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-1">
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
                                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 transition-all ${
                                        error && !email.trim() 
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
                                    className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 transition-all ${
                                        error && !password.trim() 
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
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
                        <p>Authorized personnel only. Unauthorized access is prohibited.</p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-hawaii-coral rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
        </div>
    );
};

export default Login;
