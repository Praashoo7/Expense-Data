import React, { useState, useRef, useEffect } from "react";
import { auth, db } from "./Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import NButton from "./NButton";
import ThemeToggle from "./ThemeToggle";

function SignUp() {

    function openModal(){
        document.getElementById("modalAuthorization").style.display = "flex"
        document.getElementById("modalOverlayAuthorization").style.display = "flex"
        document.getElementById("wrapperLogin").style.filter = "blur(5px)"
        document.querySelector("#modalOverlayAuthorization #menuWrapper #corner1").style.animation = "none"
        document.querySelector("#modalOverlayAuthorization #menuWrapper #corner2").style.animation = "none"
        document.querySelector("#modalOverlayAuthorization #menuWrapper #corner3").style.animation = "none"
        document.querySelector("#modalOverlayAuthorization #menuWrapper #corner4").style.animation = "none"
        setTimeout(() => {
            document.querySelector("#modalOverlayAuthorization #menuWrapper #corner1").style.opacity = 1
            document.querySelector("#modalOverlayAuthorization #menuWrapper #corner2").style.opacity = 1
            document.querySelector("#modalOverlayAuthorization #menuWrapper #corner3").style.opacity = 1
            document.querySelector("#modalOverlayAuthorization #menuWrapper #corner4").style.opacity = 1
        }, 100);
        setTimeout(() => {
            document.getElementById("modalAuthorization").style.opacity = "1"
        }, 300);

        document.querySelector("#modalOverlayAuthorization #menuWrapper #corner1").style.animation = "0.35s openCorner1 linear forwards"
        document.querySelector("#modalOverlayAuthorization #menuWrapper #corner2").style.animation = "0.35s openCorner2 linear forwards"
        document.querySelector("#modalOverlayAuthorization #menuWrapper #corner3").style.animation = "0.35s openCorner3 linear forwards"
        document.querySelector("#modalOverlayAuthorization #menuWrapper #corner4").style.animation = "0.35s openCorner4 linear forwards"
    }
    
    function closeModal(){

        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner1`).style.animation = "none"
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner2`).style.animation = "none"
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner3`).style.animation = "none"
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner4`).style.animation = "none"
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner1`).style.opacity = 1
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner2`).style.opacity = 1
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner3`).style.opacity = 1
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner4`).style.opacity = 1
        document.getElementById('modalAuthorization').style.opacity = "0"
        setTimeout(() => {
            document.getElementById('modalOverlayAuthorization').style.display = "none"
            document.getElementById('modalAuthorization').style.display = "none"
            document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner1`).style.animation = "none"
            document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner2`).style.animation = "none"
            document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner3`).style.animation = "none"
            document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner4`).style.animation = "none"
        }, 300);
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner1`).style.animation = "0.35s closeCorner1 linear forwards"
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner2`).style.animation = "0.35s closeCorner2 linear forwards"
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner3`).style.animation = "0.35s closeCorner3 linear forwards"
        document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner4`).style.animation = "0.35s closeCorner4 linear forwards"

        setTimeout(() => {
            document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner1`).style.opacity = 0
            document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner2`).style.opacity = 0
            document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner3`).style.opacity = 0
            document.querySelector(`#modalOverlayAuthorization #menuWrapper #corner4`).style.opacity = 0
            document.getElementById("wrapperLogin").style.filter = "blur(0)"
        }, 300);
    }

    const [keyboardMode, setKeyboardMode] = useState(false);
    const keyboardModeRef = useRef(false);

    useEffect(() => {
        keyboardModeRef.current = keyboardMode;
    }, [keyboardMode]);

    useEffect(() => {
        const handleKeyDown = (event) => {
        const authorizationModal = document.getElementById("modalOverlayAuthorization");

        const modalVisible =
            authorizationModal?.style.display === "flex";

        let focusScope = document;
        if (authorizationModal?.style.display === "flex") {
            focusScope = authorizationModal;
        }

        const getFocusable = () => 
        Array.from(focusScope.querySelectorAll('[tabindex="0"]'))
            .filter(
                (el) => el.offsetParent !== null && // visible in layout
                window.getComputedStyle(el).display !== "none"
            );

        const activeElement = document.activeElement;
        const isTyping =
            activeElement &&
            (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.isContentEditable);

        if (event.key === "Enter" && !keyboardModeRef.current) {
            if (authorizationModal?.style.display === "flex") {
            const button = document.getElementById("btnModalUpdate");
            if (button) button.click();
            }
        }

        if (["ArrowDown"].includes(event.key) || (["ArrowRight"].includes(event.key) && (!isTyping))) {
            event.preventDefault();
            setKeyboardMode(true);
            const focusable = getFocusable();
            const currentIndex = focusable.indexOf(document.activeElement);
            const nextIndex = (currentIndex + 1) % focusable.length;
            focusable[nextIndex]?.focus();
        }

        if (["ArrowUp"].includes(event.key) || (["ArrowLeft"].includes(event.key) && (!isTyping))) {
            event.preventDefault();
            setKeyboardMode(true);
            const focusable = getFocusable();
            const currentIndex = focusable.indexOf(document.activeElement);
            const prevIndex = currentIndex === 0 ? focusable.length - 1 : currentIndex - 1;
            focusable[prevIndex]?.focus();
        }

        if (event.key === "Enter" && keyboardModeRef.current) {
            event.preventDefault();
            const el = document.activeElement;
            if (el) {
            el.classList.add("key-press-active");
            setTimeout(() => {
                el.classList.remove("key-press-active");
            }, 100);

            ["mousedown", "mouseup", "click"].forEach((type) => {
                const evt = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                });
                el.dispatchEvent(evt);
            });
            }
        }

        if (event.key === "Escape") {
            setKeyboardMode(false);
            document.activeElement.blur();

            if (authorizationModal?.style.display === "flex") {
            const button = document.getElementById("cancelBtnUpdate");
            if (button) button.click();
            }
        }
        };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
            document.getElementById("username").value.trim() === "" ||
            document.getElementById("password").value.trim() === "" ||
            document.getElementById("email").value.trim() === ""
        ) {
            setError("Empty Fields!");
            return;
        } else if(!emailRegex.test(document.getElementById("email").value.trim())){
            setError("Email looks like this example@domain.com");
            return;
        }

        openModal();
        await new Promise((resolve) => setTimeout(resolve, 400));

        try {

            const usernameDoc = await getDoc(doc(db, "usernames", username));
            if (usernameDoc.exists()) {
                setError("Username already taken");
                closeModal();
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, "users", uid), {
                uid: uid,
                email: email,
                username: username,
                data: []
            });

            await setDoc(doc(db, "usernames", username), {
                uid: uid
            });

            localStorage.setItem("uid", uid);
            localStorage.setItem("username", username);

            document.getElementById("authText").textContent = "Signed Up";
            setTimeout(() => closeModal(), 300);
            setTimeout(() => navigate("/Login"), 650);
        } catch (err) {
            setError(err.message);
            closeModal();
        }
    };

    const handleLogin = () => {
        navigate("/Login")
    }

    useEffect(() => {
    const username = localStorage.getItem("loggedInUsername");
    if (username) {
        navigate(`/${username}`);
    }
    }, []);

  return (
    <>
    <div className="wrapper" id="wrapperLogin">
        <div className="loginForm">
        <h2>SignUp</h2>
        <div className="loginInput">
            <input autoComplete="off" id="email" tabIndex={0} type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/>
            <input autoComplete="off" id="username" tabIndex={0} placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br/>
            <input autoComplete="off" id="password" tabIndex={0} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br/>
        </div>
        <div className="loginBtns">
            <NButton clickData={handleSignUp} btnName={"SignUp"} width={"100%"} height={"2.5em"} />
            <NButton clickData={handleLogin} btnName={"Login"} width={"100%"} height={"2.5em"} />
        </div>
        <div className="cornerBtnE11"></div>
        <div className="cornerBtnE12"></div>
        <div className="cornerBtnE13"></div>
        <div className="cornerBtnE14"></div>
        </div>
        {error && <p style={{ color: "var(--color7)", marginTop: "1em" }}>{error}</p>}
    </div>
    <div className="modalOverlay" id="modalOverlayAuthorization">
        <div className="menuWrapper" id="menuWrapper">
            <div className="corner1" id="corner1"></div>
            <div className="corner2" id="corner2"></div>
            <div className="corner3" id="corner3"></div>
            <div className="corner4" id="corner4"></div>
            <div className="modal" id="modalAuthorization" style={{ alignItems:"center" }}>
                <h1 className="authText" style={{ marginTop: "0.15em" }} id="authText">Signing Up<div className="text-loader"></div></h1>
            </div>
        </div>
    </div>
    <div className="small_device">
        <div className="small_device_card">
            <div className="small_device_text">
                Add an Expense here after buying a bigger Display.
            </div>
        </div>
    </div>
    <ThemeToggle btnWidth={"0"} displayMode={"none"} />
    </>
  );
}

export default SignUp;
