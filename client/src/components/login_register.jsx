import { useRef } from "react";
import "../styles/login&register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGooglePlusG } from "@fortawesome/free-brands-svg-icons";
import Logo from "../assets/RED-In.png";


export default function LoginRegister() {
    const containerRef = useRef(null);

    const handleRegister = () => {
        containerRef.current.classList.add("active");
    };

    const handleLogin = () => {
        containerRef.current.classList.remove("active");
    };

    return (
        <div className="loginRegister">
            <div className="container" id="container" ref={containerRef}>
                {/* SIGN UP */}

                <div className="form-container sign-up">
                    <form>
                        <h1>Create Account</h1>
                        <div className="social-icons">
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faGooglePlusG} />
                            </a>
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                        </div>

                        <span>or use your email for registration</span>
                        <input type="text" placeholder="Name" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <button type="button">Sign Up</button>
                    </form>
                </div>

                {/* SIGN IN */}
                <div className="form-container sign-in">
                    <form>
                        <h1>Sign In</h1>
                        <div className="social-icons">
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faGooglePlusG} />
                            </a>
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                        </div>

                        <span>or use your email password</span>
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <a href="#">Forget Your Password?</a>
                        <button type="button">Sign In</button>
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
