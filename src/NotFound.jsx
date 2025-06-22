import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NButton from "./NButton";

function NotFound() {

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

        const getFocusable = () => Array.from(focusScope.querySelectorAll('[tabindex="0"]'));

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

    const navigate = useNavigate()
    const handleLogin = () => {
        navigate("/Login")
    }

  return (
    <>
    <div className="wrapper" id="wrapperLogin">
        <div className="loginForm">
        <h2 style={{ textAlign: "center", fontSize: "7em" }}>404</h2>
        <NButton clickData={handleLogin} btnName={"Back to Login"} width={"100%"} height={"2.5em"} />
        </div>
    </div>
    <div className="small_device">
        <div className="small_device_card">
            <div className="small_device_text">
                Add an Expense here after buying a bigger Display.
            </div>
        </div>
    </div>
    </>
  );
}

export default NotFound;
