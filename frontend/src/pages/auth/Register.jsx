import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from 'react-toastify';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //     // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await axios.post(import.meta.env.VITE_API_URL + "user/register", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                address: formData.address,
            });

            toast.success("Registration Successful");
            navigate("/login");
        } catch (err) {
            toast.error("Registration failed");
            setError(err.response?.data?.message || "Registration failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-auto flex justify-center items-center bg-white py-20">
            <div className="flex items-center justify-center lg:justify-start w-xl">
                <div className="w-full">
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-black/40 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Sign up to get started</p>
                    </div>
                    <div className="bg-white p-8 shadow-xl border border-gray-200">
                        <div className="hidden lg:block text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Create Account</h2>
                            <p className="text-gray-600">Sign up to get started</p>
                        </div>
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        )}
                        <div className="space-y-5">
                            <Input label="Full Name" name="username" value={formData.username} placeholder="Enter your full name" onChange={handleChange}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                }
                            />

                            <Input label="Email Address" name="email" type="email" value={formData.email} placeholder="Enter your email address" onChange={handleChange}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                }
                            />

                            <Input label="Address" name="address" value={formData.address}
                                placeholder="Enter your address"
                                onChange={handleChange}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                }
                            />

                            <Input label="Password" name="password" type="password" value={formData.password} placeholder="Create a strong password" onChange={handleChange}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                }
                            />

                            <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} placeholder="Confirm your password" onChange={handleChange}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-2 accent-darkprimary" required />
                                <span className="text-gray-600 text-sm">
                                    I AGREE TO THE <Link to="/terms-and-condition" className="text-darkprimary hover:underline">TERMS AND CONDITIONS</Link>
                                </span>
                            </div>
                            <button
                                onClick={handleSubmit}
                                className={`w-full py-4 px-6 font-semibold text-white transition-all duration-300 transform ${loading
                                    ? "bg-gray-400 cursor-not-allowed scale-100"
                                    : "bg-darkprimary hover:bg-darkprimary/90 hover:scale-105 hover:shadow-2xl active:scale-95"
                                    } shadow-lg`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin mr-3"></div>
                                        Creating your account...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <span>Create Account</span>
                                    </div>
                                )}
                            </button>
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-semibold text-darkprimary hover:text-darkprimary/80 transition-colors hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Input = ({ label, name, value, onChange, placeholder, type = "text", icon }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasValue = !!value;
    const isPassword = type === "password";

    return (
        <div className="relative">
            <div className="relative">
                {/* <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10">
                    {icon}
                </div> */}
                <input
                    id={name}
                    type={isPassword && showPassword ? "text" : type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={isFocused ? placeholder : ''}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        w-full pl-4 pr-12 py-3 bg-gray-50 border-2
                        text-darkText placeholder-gray-400 transition-all duration-200
                        ${isFocused
                            ? 'border-darkprimary bg-white shadow-lg shadow-darkprimary/30'
                            : 'border-gray-200 hover:border-gray-300'
                        }
                        ${hasValue ? 'bg-white border-gray-300' : ''}
                        focus:outline-none
                    `}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
                )}
                <label
                    htmlFor={name}
                    className={`
                        absolute left-4 pointer-events-none transition-all duration-200 font-medium
                        ${(isFocused || hasValue)
                            ? 'top-1 text-xs text-darkprimary'
                            : 'top-1/2 transform -translate-y-1/2 text-sm text-gray-600'
                        }
                    `}
                >
                    {label} <span className='text-red-500'>*</span>
                </label>
            </div>
        </div>
    );
};

export default RegisterPage;