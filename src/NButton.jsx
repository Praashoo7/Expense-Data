import "./App.css"

function NButton(props){

    return(
        <>
        <style>{`
            .okBtn{
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                min-height: 2.5em;
                background-color: #171717;
                color: #e4e4e4;
                font-size: 1em;
                user-select: none;
                cursor: pointer;
                outline: none;
                border: 1px solid var(--color14);
            }
            .okBtn:active {
                background-color: #686868;
            }
            .key-press-active {
                background-color: #686868;
            }
            .okBtn:is(:hover, :focus) span{
                animation: hoverText 1s ease-in-out infinite;
            }
            @keyframes hoverText {
                0% {
                    opacity: 1;
                }
                50% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }

            .okBtn:is(:hover, :focus) .cornerBtn11,
            .okBtn:is(:hover, :focus) .cornerBtn12,
            .okBtn:is(:hover, :focus) .cornerBtn13,
            .okBtn:is(:hover, :focus) .cornerBtn14 {
                opacity: 1;
            }
            .okBtn:active .cornerBtn11 {
                transform: translateX(2px) translateY(2px);
                transition: all 0.05s ease-in-out;
            }
            .okBtn:active .cornerBtn12 {
                transform: translateX(-2px) translateY(2px);
                transition: all 0.05s ease-in-out;
            }
            .okBtn:active .cornerBtn13 {
                transform: translateX(2px) translateY(-2px);
                transition: all 0.05s ease-in-out;
            }
            .okBtn:active .cornerBtn14 {
                transform: translateX(-2px) translateY(-2px);
                transition: all 0.05s ease-in-out;
            }
            .key-press-active .cornerBtn11 {
                transform: translateX(2px) translateY(2px);
                transition: all 0.05s ease-in-out;
            }
            .key-press-active .cornerBtn12 {
                transform: translateX(-2px) translateY(2px);
                transition: all 0.05s ease-in-out;
            }
            .key-press-active .cornerBtn13 {
                transform: translateX(2px) translateY(-2px);
                transition: all 0.05s ease-in-out;
            }
            .key-press-active .cornerBtn14 {
                transform: translateX(-2px) translateY(-2px);
                transition: all 0.05s ease-in-out;
            }

            .cornerBtn11,
            .cornerBtn12,
            .cornerBtn13,
            .cornerBtn14 {
                position: absolute;
                width: 0.75em;
                height: 0.75em;
                background-color: transparent;
                margin: -0.45em;
                opacity: 0;
            }
            .cornerBtn11{
                top: 0;
                left: 0;
                border-top: 2px solid var(--color4);
                border-left: 2px solid var(--color4);
            }
            .cornerBtn12 {
                top: 0;
                right: 0;
                border-top: 2px solid var(--color4);
                border-right: 2px solid var(--color4);
            }
            .cornerBtn13 {
                bottom: 0;
                left: 0;
                border-bottom: 2px solid var(--color4);
                border-left: 2px solid var(--color4);
            }
            .cornerBtn14 {
                bottom: 0;
                right: 0;
                border-bottom: 2px solid var(--color4);
                border-right: 2px solid var(--color4);
            }
        `}</style>
        <div tabIndex={0} className="okBtn" id={props.btnID} onClick={props.clickData} style={{ width: props.width, height: props.height, display:props.displayMode }}>
            <span>{props.btnName}</span>
            <div className="cornerBtn11"></div>
            <div className="cornerBtn12"></div>
            <div className="cornerBtn13"></div>
            <div className="cornerBtn14"></div>
        </div>
        </>
    )
}

export default NButton