import { useEffect, useState } from "react";
import NButton from "./NButton";

function ThemeToggle() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <>
            <style>{`
                .theme-toggle-btn {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    width: 6em;
                    background-color: #171717;
                    color: #e4e4e4;
                    height: 2.5em;
                    border: none;
                    border-radius: 5px;
                    font-weight: bold;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }

                .theme-toggle-btn:hover {
                    background-color: #2c2c2c;
                }
            `}</style>

            <NButton className="theme-toggle-btn" btnID={"themeBtn"} clickData={toggleTheme} width={"5em"} btnName={theme === "dark" ? "Dark" : "Light"} />
        </>
    );
}

export default ThemeToggle;

// import { useEffect, useState } from "react";

// function ThemeToggle() {
//     const [theme, setTheme] = useState("light");

//     useEffect(() => {
//         const savedTheme = localStorage.getItem("theme") || "light";
//         setTheme(savedTheme);
//         document.documentElement.setAttribute("data-theme", savedTheme);
//     }, []);

//     const toggleTheme = () => {
//         const newTheme = theme === "light" ? "dark" : "light";
//         setTheme(newTheme);
//         document.documentElement.setAttribute("data-theme", newTheme);
//         localStorage.setItem("theme", newTheme);
//     };

//     return (
//         <>
//         <style>{
//             .theme-switch-second {
//                 position: relative;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 cursor: pointer;
//                 width: 5em;
//                 background-color: #171717;
//                 color: #e4e4e4;
//                 height: 100%;
//                 transition: .4s;
//             }
//             #checkboxsecond{
//                 position: absolute;
//             }

//             .theme-switch-second:hover{
//                 cursor: pointer;
//             }

//             .theme-switch-second input[type=checkbox] {
//                 visibility: hidden;
//             }

//             .theme-switch-second .slider-second {
//                 transition: 300ms ease;
//             }
//         }</style>
//         <label className="theme-switch-second">
//             <input
//                 type="checkbox"
//                 checked={theme === "dark"}
//                 onChange={toggleTheme}
//                 id="checkboxsecond"
//             />
//             <span id="themeText">{theme === "dark" ? "Light" : "Dark"}</span>
//         </label>
//         </>
//     );
// }

// export default ThemeToggle;