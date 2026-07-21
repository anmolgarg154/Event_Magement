import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { toast } from 'react-toastify';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { user, setUser } = useAuthContext();

    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(["rememberedEmail"]);

    useEffect(() => {
        if (cookies.rememberedEmail) {
            setFormData((prev) => ({ ...prev, email: cookies.rememberedEmail }));
            setRememberMe(true);
        }
    }, [cookies]);

    useEffect(() => {
        let interval = null;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear errors when user starts typing
        if (error) setError("");
    };

    const handleRememberMe = (e) => { setRememberMe(e.target.checked) }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                import.meta.env.VITE_API_URL + `user/login`,
                {
                    email: formData.email,
                    password: formData.password,
                },
                { withCredentials: true } // Enable cookies 
            );

            setUser(response.data.data);

            if (rememberMe) {
                setCookie("rememberedEmail", formData.email, { path: "/", maxAge: 7 * 24 * 60 * 60 }); // 7 days
            } else {
                removeCookie("rememberedEmail");
            }
            toast.success("Login completed!")
            navigate("/");
        } catch (err) {
            console.log(err)
            toast.error("Login failed!")
            setError(err.response?.data?.message || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center py-16">
                <div className="w-full max-w-lg p-8 shadow-xl border border-gray-400">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to continue to your account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-darkprimary focus:border-transparent transition-all duration-200 text-gray-900"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-darkprimary focus:border-transparent transition-all duration-200 text-gray-900"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={handleRememberMe}
                                    className="h-4 w-4 accent-darkprimary border-gray-300"
                                />
                                <label className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 mt-12 font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-darkprimary hover:bg-darkprimary/90 hover:shadow-lg transform hover:scale-[1.02]"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-darkprimary hover:underline hover:text-darkprimary/80 font-semibold transition-colors"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
