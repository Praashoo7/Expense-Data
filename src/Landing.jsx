import NButton from "./NButton"
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

function Landing(){

    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate("/SignUp")
    }
    const handleLogin = () =>{
        navigate("/Login")
    }

    const featuresList = ["Simple", "Elegant", "Secure", "Functional", "AS GOOD AS NFS", "Minimalistic", "Clean", "Modern", "Sleek", "Polished"]
    const itemsList = ["Bills", "Netflix", "Food", "Trip", "Storage", "Groceries", "Uber", "Gas", "Donations", "Repairs", "Rent", "Kindle", "GitHub", "Shoes", "Car Wash", "Credit Card", "Tickets", "Souvenirs", "Gift", "Pet Food", "Clothes", "Snacks", "EMI"]
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentIndex1, setCurrentIndex1] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuresList.length);
        }, 1500);

        return () => clearInterval(interval); // Clean up on unmount
    }, [featuresList.length]);
    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex1((prevIndex) => (prevIndex + 1) % featuresList.length);
        }, 2500);

        return () => clearInterval(interval); // Clean up on unmount
    }, [itemsList.length]);

    return(
        <>
        <style>
        {`
        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 20px;
        }

        .main-grid {
        position: relative;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
            min-height: 95.5vh;
            border: 1px solid var(--color6);
        }

        .empty-space {
        position: relative;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color4);
            font-size: 1rem;
            min-height: 100px;
            border: 1px solid var(--color6);
        }

        .empty-space.bottom {
            border-bottom: none;
            border: 1px solid var(--color6);
        }

        .middle-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr;
        }

        .hero-section {
            background: transparent;
            padding: 60px 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            border: 1px solid var(--color6);
        }

        .hero-title {
            font-size: 4rem;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 20px;
            text-transform: uppercase;
            color: var(--color4);
            line-height: 0.9;
        }

        .hero-subtitle {
            font-size: 0.85em;
            color: var(--color4);
        }

        .right-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
        }

        .content-block {
            background: transparent;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--color6);
            box-sizing: border-box;
        }

        .content-block.top-left {
            border-right: none;
            border-bottom: none;
        }

        .content-block.top-right {
            background-color: var(--color2);
            border: 1px solid var(--color6);
        }

        .content-block.bottom-left {
            background-color: var(--color2);
            border: 1px solid var(--color6);
        }

        .image-placeholder {
            width: 100%;
            height: 100%;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color4);
            overflow: hidden;
        }

        .text-content {
            color: var(--color4);
            font-size: 1em;
            text-align: center;
        }

        .image-below {
            margin-top: 15px;
            margin-bottom: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .middle-section {
                grid-template-columns: 1fr;
                grid-template-rows: auto auto;
            }

            .hero-section {
                border-right: none;
                border: 1px solid var(--color6);
                text-align: center;
                align-items: center;
                padding: 40px 20px;
            }

            .right-section {
                display: "none";
            }

            .content-block {
                border: 1px solid var(--color6);
                border-top: none;
            }

            .content-block.top-left,
            .content-block.top-right,
            .content-block.bottom-left {
                border-right: 3px solid #000;
                border: 1px solid var(--color6);
            }

            .hero-title {
                font-size: 2.5rem;
            }

            .container {
                padding: 10px;
            }
        }

        @media (max-width: 480px) {
            .hero-title {
                font-size: 2rem;
                letter-spacing: 1px;
            }

            .content-block {
                padding: 15px;
            }

            .image-placeholder {
                width: 60px;
                height: 45px;
            }
        }
        @media (max-width: 335px) {
            .btns{
                flex-direction: column;
            }
        }
        .banner {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-wrap: nowrap;
        white-space: nowrap;
        overflow: hidden;
        transition: 0.1s all ease-in-out;
        }
        .marqueeContainer {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        transform: translateY(-50%);
        white-space: nowrap;
        overflow: hidden;
        font-size: 1em;
        font-weight: bold;
        }
        .marquee {
        display: inline-block;
        animation: marquee 60s linear infinite;
        }
        .marquee1 {
        display: inline-block;
        animation: marquee1 60s linear infinite;
        }
        @keyframes marquee {
        0% {
            transform: translateX(0%);
        }
        100% {
            transform: translateX(-50%);
        }
        }
        @keyframes marquee1 {
        0% {
            transform: translateX(-50%);
        }
        100% {
            transform: translateX(0%);
        }
        }
        .cornerBtnE11,
        .cornerBtnE12,
        .cornerBtnE13,
        .cornerBtnE14 {
            position: absolute;
            width: 0.75em;
            height: 0.75em;
            background-color: transparent;
            margin: -1px;
            opacity: 0.5;
        }
        .cornerBtnE11{
            top: 0;
            left: 0;
            border-top: 1px solid var(--color4);
            border-left: 1px solid var(--color4);
        }
        .cornerBtnE12 {
            top: 0;
            right: 0;
            border-top: 1px solid var(--color4);
            border-right: 1px solid var(--color4);
        }
        .cornerBtnE13 {
            bottom: 0;
            left: 0;
            border-bottom: 1px solid var(--color4);
            border-left: 1px solid var(--color4);
        }
        .cornerBtnE14 {
            bottom: 0;
            right: 0;
            border-bottom: 1px solid var(--color4);
            border-right: 1px solid var(--color4);
        }
        `}
        </style>
        <div class="container">
        <div class="main-grid">
            <div class="empty-space">
                <div class="banner">
                    <div class="marqueeContainer">
                        <div class="marquee">
                         Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | 
                        </div>
                    </div>
                </div>
            </div>

            <div class="middle-section">
                <div class="hero-section">
                    <h1 class="hero-title">Got Expenses?</h1>
                    <p class="hero-subtitle">Well, I got a nice way to Organize them, Manage them, Store them and keep track of them with Expense Chart and reports.</p>
                    <div className="btns" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1em", padding: "2em 1em 1em 0" }}>
                        <NButton btnName={"Login"} clickData={handleLogin} width={"7em"} height={"2.5em"} />
                        <NButton btnName={"SignUp"} clickData={handleSignUp} width={"7em"} height={"2.5em"} />
                    </div>
                </div>

                <div class="right-section">
                    <div class="content-block top-left">
                        <div className="text-loader" style={{ fontSize: "1.5em" }}></div>
                    </div>

                    <div class="content-block top-right">
                        <div class="text-content" id="textContentFeatures">[ {featuresList[currentIndex]} ]</div>
                    </div>

                    <div class="content-block bottom-left">
                        <div class="text-content" id="textContentItems">[ {itemsList[currentIndex1]} ]</div>
                    </div>

                    <div class="content-block bottom-right">
                        <div className="text-loader1" style={{ fontSize: "1.5em" }}></div>
                    </div>
                </div>
            </div>

            <div class="empty-space bottom">
                <div class="banner">
                    <div class="marqueeContainer">
                        <div class="marquee1">
                          Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | Expense-Data | 
                        </div>
                    </div>
                </div>
            </div>
                    <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
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
    )
}

export default Landing