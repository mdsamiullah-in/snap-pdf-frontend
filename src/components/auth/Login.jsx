import { useState } from "react";
import { Link } from "react-router-dom";
import http from "../../../util/http";
import Swal from "sweetalert2"; // ✅ Import SweetAlert

const Login = () => {
    const loginFormModel = {
        email: '',
        password: ''
    };

    const [loginForm, setLoginForm] = useState(loginFormModel);
    const [type, setType] = useState('password');

    const login = async (e) => {
        e.preventDefault();

        try {
            await http.post('/api/user/login', loginForm);

            // ✅ Redirect on success
            window.location = "/user/layout/workspace";
        } catch (err) {
            console.error(err);

            // ✅ Always show a generic message
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid email or password.', // 👈 hardcoded generic message
                confirmButtonColor: '#155DFC'
            });
        }
    };

    const handleLoginForm = (e) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="bg-gray-200 min-h-screen flex justify-center items-center animate__animated animate__fadeIn">
            <div className="bg-white rounded-lg w-[480px] p-6 animate__animated animate__pulse">
                <div className="space-y-1 text-center">
                    <h1 className="text-3xl font-bold font-[calibri] text-gray-800">Log In</h1>
                    <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                        Login to
                        <span className="flex items-center gap-1">
                            <img src="./images/logos.png" alt="logo" className="w-[100px]" />
                        </span>
                    </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={login}>
                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-base">Email</label>
                        <input
                            className="border border-gray-300 rounded p-2"
                            placeholder="mail@gmail.com"
                            name="email"
                            type="email"
                            value={loginForm.email}
                            onChange={handleLoginForm}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="font-medium text-base">Password</label>
                        <input
                            className="border border-gray-300 rounded p-2 pr-12"
                            placeholder="**********"
                            name="password"
                            type={type}
                            value={loginForm.password}
                            onChange={handleLoginForm}
                            required
                        />
                        <button
                            type="button"
                            className="absolute top-9 right-2 bg-gray-100 w-8 h-8 rounded-full hover:bg-gray-200"
                            onClick={() => setType(prev => prev === "password" ? "text" : "password")}
                        >
                            {type === "password" ? <i className="ri-eye-line"></i> : <i className="ri-eye-off-line"></i>}
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-[#155DFC] text-white p-2 rounded font-medium"
                    >
                        Sign in
                    </button>
                </form>

                {/* Register */}
                <div className="flex gap-2 mt-4">
                    <label className="text-gray-500">Don't have an account?</label>
                    <Link to="/signup" className="text-[#155DFC]">Register now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
