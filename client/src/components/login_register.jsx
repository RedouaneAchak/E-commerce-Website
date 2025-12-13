import { useRef, useState } from "react";
import "../styles/login&register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGooglePlusG } from "@fortawesome/free-brands-svg-icons";
import Logo from "../assets/RED-In.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function LoginRegister() {
    const containerRef = useRef(null);

    const { login, register } = useAuth();
    const navigate = useNavigate();


    // FORM STATES
    const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });

    const handleRegister = () => {
        containerRef.current.classList.add("active");
    };

    const handleLogin = () => {
        containerRef.current.classList.remove("active");
    };

    // SUBMIT REGISTER
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = registerForm;

        const res = await register(name, email, password);
        if (!res.success) {
            alert("Registration error: " + res.error);
        } else {
            alert("Account created!");
            navigate("/"); // redirect to home
        }
    };

   const handleLoginSubmit = async (e) => {
  e.preventDefault();
  const { email, password } = loginForm;

  const res = await login(email, password);

  if (!res.success) {
    alert("Login error: " + res.error);
  } else if (res.user) {
    alert("Logged in!");
    if (res.user.isAdmin) {
      console.log("Admin logged in");
      navigate("/admin_welcome"); // redirect admin
    } else {
      console.log("User logged in");
      navigate("/"); // redirect regular user
    }
  } else {
    // Safety fallback in case user is missing
    alert("Login succeeded but user data is missing.");
    navigate("/");
  }
};





    return (
        <div className="loginRegister">
            <div className="container" id="container" ref={containerRef}>

                {/* SIGN UP */}
                <div className="form-container sign-up">
                    <form onSubmit={handleRegisterSubmit}>
                        <h1>Create Account</h1>

                        <div className="social-icons">
                            <a href="#" className="icon"><FontAwesomeIcon icon={faGooglePlusG} /></a>
                            <a href="#" className="icon"><FontAwesomeIcon icon={faFacebookF} /></a>
                        </div>

                        <span>or use your email for registration</span>

                        <input
                            type="text"
                            placeholder="Name"
                            value={registerForm.name}
                            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        />

                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                {/* SIGN IN */}
                <div className="form-container sign-in">
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Sign In</h1>

                        <div className="social-icons">
                            <a href="#" className="icon"><FontAwesomeIcon icon={faGooglePlusG} /></a>
                            <a href="#" className="icon"><FontAwesomeIcon icon={faFacebookF} /></a>
                        </div>

                        <span>or use your email password</span>

                        <input
                            type="email"
                            placeholder="Email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        />

                        <a href="#">Forget Your Password?</a>
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                {/* TOGGLE PANEL */}
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <img className="Logo" src={Logo} alt="LOGO" />
                            <h1>Welcome Back!</h1>
                            <button className="hidden" onClick={handleLogin}>Sign In</button>
                        </div>

                        <div className="toggle-panel toggle-right">
                            <img className="Logo" src={Logo} alt="LOGO" />
                            <h1>Hello, Friend!</h1>
                            <button className="hidden" onClick={handleRegister}>Sign Up</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
