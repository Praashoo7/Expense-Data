import React, { useState, useRef, useEffect } from "react";
import { getAuth, confirmPasswordReset } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import NButton from "./NButton";
import ThemeToggle from "./ThemeToggle";

function ResetPassword() {
  const navigate = useNavigate();

    function openModal(){
        document.getElementById("modalResetPassword").style.display = "flex"
        document.getElementById("modalOverlayResetPassword").style.display = "flex"
        document.getElementById("wrapperLogin").style.filter = "blur(5px)"
        document.querySelector("#modalOverlayResetPassword #menuWrapper #corner1").style.animation = "none"
        document.querySelector("#modalOverlayResetPassword #menuWrapper #corner2").style.animation = "none"
        document.querySelector("#modalOverlayResetPassword #menuWrapper #corner3").style.animation = "none"
        document.querySelector("#modalOverlayResetPassword #menuWrapper #corner4").style.animation = "none"
        setTimeout(() => {
            document.querySelector("#modalOverlayResetPassword #menuWrapper #corner1").style.opacity = 1
            document.querySelector("#modalOverlayResetPassword #menuWrapper #corner2").style.opacity = 1
            document.querySelector("#modalOverlayResetPassword #menuWrapper #corner3").style.opacity = 1
            document.querySelector("#modalOverlayResetPassword #menuWrapper #corner4").style.opacity = 1
        }, 100);
        setTimeout(() => {
            document.getElementById("modalResetPassword").style.opacity = "1"
        }, 300);

        document.querySelector("#modalOverlayResetPassword #menuWrapper #corner1").style.animation = "0.35s openCorner1 linear forwards"
        document.querySelector("#modalOverlayResetPassword #menuWrapper #corner2").style.animation = "0.35s openCorner2 linear forwards"
        document.querySelector("#modalOverlayResetPassword #menuWrapper #corner3").style.animation = "0.35s openCorner3 linear forwards"
        document.querySelector("#modalOverlayResetPassword #menuWrapper #corner4").style.animation = "0.35s openCorner4 linear forwards"
    }
    
    function closeModal(){

        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner1`).style.animation = "none"
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner2`).style.animation = "none"
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner3`).style.animation = "none"
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner4`).style.animation = "none"
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner1`).style.opacity = 1
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner2`).style.opacity = 1
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner3`).style.opacity = 1
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner4`).style.opacity = 1
        document.getElementById('modalResetPassword').style.opacity = "0"
        setTimeout(() => {
            document.getElementById('modalOverlayResetPassword').style.display = "none"
            document.getElementById('modalResetPassword').style.display = "none"
            document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner1`).style.animation = "none"
            document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner2`).style.animation = "none"
            document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner3`).style.animation = "none"
            document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner4`).style.animation = "none"
        }, 300);
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner1`).style.animation = "0.35s closeCorner1 linear forwards"
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner2`).style.animation = "0.35s closeCorner2 linear forwards"
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner3`).style.animation = "0.35s closeCorner3 linear forwards"
        document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner4`).style.animation = "0.35s closeCorner4 linear forwards"

        setTimeout(() => {
            document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner1`).style.opacity = 0
            document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner2`).style.opacity = 0
            document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner3`).style.opacity = 0
            document.querySelector(`#modalOverlayResetPassword #menuWrapper #corner4`).style.opacity = 0
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


    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get("oobCode");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleResetPassword = async (e) => {
      e.preventDefault();
      setError("");
      setMessage("");
      if (!newPassword) return setError("Please enter a new password");

      const oobCode = searchParams.get('oobCode');

      try {
        const auth = getAuth();

        openModal();
        await new Promise((resolve) => setTimeout(resolve, 400));

        await confirmPasswordReset(auth, oobCode, newPassword); 
        setMessage(`Password has been reset successfully. Redirecting to Login Page.`);
        closeModal()
        setTimeout(() => {
          navigate("/Expense-Data/Login")
        }, 5000);
      } catch (err) {
        closeModal()
        setError("Error resetting password. The link might have expired or is invalid.");
      }
    };

  return (
    <>
    <div className="wrapper" id="wrapperLogin">
      <div className="loginForm">
        <h2>New Password</h2>
        <div className="resetData">
          <input 
            autoComplete="off"
            tabIndex={0}
            type="password"
            id="resetPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <NButton clickData={handleResetPassword} btnName={"Submit"} height={"2.5em"} width={"100%"} />
        </div>
      </div>
        {message && <p style={{ color: "var(--color7)", marginTop: "1em", display:"flex" }}>{message}<div className="text-loader"></div></p>}
      {error && <p style={{ color: "var(--color7)", marginTop: "1em" }}>{error}</p>}
    </div>
    <div className="modalOverlay" id="modalOverlayResetPassword">
        <div className="menuWrapper" id="menuWrapper">
            <div className="corner1" id="corner1"></div>
            <div className="corner2" id="corner2"></div>
            <div className="corner3" id="corner3"></div>
            <div className="corner4" id="corner4"></div>
            <div className="modal authM" id="modalResetPassword" style={{ alignItems:"center" }}>
                <h1 className="authText" style={{ marginTop: "0.15em" }} id="authText">Securing<div className="text-loader"></div></h1>
            </div>
        </div>
    </div>
    <ThemeToggle btnWidth={"0"} displayMode={"none"} />
    </>
  );
}

export default ResetPassword;