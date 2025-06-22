import React, { useState, useRef, useEffect } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import NButton from "./NButton";
import ThemeToggle from "./ThemeToggle";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function openModal(){
        document.getElementById("modalResetLinkSend").style.display = "flex"
        document.getElementById("modalOverlayResetLinkSend").style.display = "flex"
        document.getElementById("wrapperLogin").style.filter = "blur(5px)"
        document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner1").style.animation = "none"
        document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner2").style.animation = "none"
        document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner3").style.animation = "none"
        document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner4").style.animation = "none"
        setTimeout(() => {
            document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner1").style.opacity = 1
            document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner2").style.opacity = 1
            document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner3").style.opacity = 1
            document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner4").style.opacity = 1
        }, 100);
        setTimeout(() => {
            document.getElementById("modalResetLinkSend").style.opacity = "1"
        }, 300);

        document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner1").style.animation = "0.35s openCorner1 linear forwards"
        document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner2").style.animation = "0.35s openCorner2 linear forwards"
        document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner3").style.animation = "0.35s openCorner3 linear forwards"
        document.querySelector("#modalOverlayResetLinkSend #menuWrapper #corner4").style.animation = "0.35s openCorner4 linear forwards"
    }
    
    function closeModal(){

        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner1`).style.animation = "none"
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner2`).style.animation = "none"
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner3`).style.animation = "none"
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner4`).style.animation = "none"
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner1`).style.opacity = 1
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner2`).style.opacity = 1
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner3`).style.opacity = 1
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner4`).style.opacity = 1
        document.getElementById('modalResetLinkSend').style.opacity = "0"
        setTimeout(() => {
            document.getElementById('modalOverlayResetLinkSend').style.display = "none"
            document.getElementById('modalResetLinkSend').style.display = "none"
            document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner1`).style.animation = "none"
            document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner2`).style.animation = "none"
            document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner3`).style.animation = "none"
            document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner4`).style.animation = "none"
        }, 300);
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner1`).style.animation = "0.35s closeCorner1 linear forwards"
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner2`).style.animation = "0.35s closeCorner2 linear forwards"
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner3`).style.animation = "0.35s closeCorner3 linear forwards"
        document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner4`).style.animation = "0.35s closeCorner4 linear forwards"

        setTimeout(() => {
            document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner1`).style.opacity = 0
            document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner2`).style.opacity = 0
            document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner3`).style.opacity = 0
            document.querySelector(`#modalOverlayResetLinkSend #menuWrapper #corner4`).style.opacity = 0
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
      setError("");

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        setMessage("")
        setError("Please enter your email address.");
        return;
      } else if(!emailRegex.test(email)){
        setMessage("")
        setError("Email looks like this example@domain.com");
        return;
      }

      try {

        const auth = getAuth();

        openModal();
        await new Promise((resolve) => setTimeout(resolve, 400));

        const db = getFirestore();
        const q = query(
          collection(db, "users"), 
          where("email", "==", email)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          closeModal()
          setMessage("")
          setError("No account found for this email.");
          return;
        }

        const actionCodeSettings = {
          url: `${window.location.origin}/#/ResetPassword`,
          handleCodeInApp: true,
        };

        await sendPasswordResetEmail(auth, email, actionCodeSettings);
        closeModal();
        setEmail("");
        setMessage("Reset Email Sent.")
      } catch (err) {
        closeModal();
        console.log(err)
        setMessage("")
        setError("Failed to send reset link. Double-check the email address or try again.");
      }
  };


  const handleBackToLogin = () => {
    navigate("/Login")
  }

  return (
    <>
    <div className="wrapper" id="wrapperLogin">
    <div className="loginForm">
      <h2>Forgot Password</h2>
        <div className="resetData">
          <input 
            autoComplete="off"
            tabIndex={0}
            id="resetEmail"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <NButton clickData={handleEmailSubmit} btnName={"Submit"} height={"2.5em"} width={"100%"} />
          <NButton clickData={handleBackToLogin} btnName={"Back to Login"} height={"2.5em"} width={"100%"} />
        </div>
      </div>
      {message && <p style={{ color: "var(--color7)", marginTop: "1em" }}>{message}</p>}
      {error && <p style={{ color: "var(--color7)", marginTop: "1em" }}>{error}</p>}
    </div>
    <div className="modalOverlay" id="modalOverlayResetLinkSend">
        <div className="menuWrapper" id="menuWrapper">
            <div className="corner1" id="corner1"></div>
            <div className="corner2" id="corner2"></div>
            <div className="corner3" id="corner3"></div>
            <div className="corner4" id="corner4"></div>
            <div className="modal authM" id="modalResetLinkSend" style={{ alignItems:"center" }}>
                <h1 className="authText" style={{ marginTop: "0.15em" }} id="authText">Verifying<div className="text-loader"></div></h1>
            </div>
        </div>
    </div>
    <ThemeToggle btnWidth={"0"} displayMode={"none"} />
    </>
  );
}

export default ForgotPassword;