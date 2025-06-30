import React, { useState, useEffect, useRef } from "react"
import NButton from "./NButton"
import ThemeToggle from "./ThemeToggle";
import { db } from "./Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./Firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function CRUD(){

    let [originalData , setOriginalData] = useState([]);

    const[itemData, setItemData] = useState([])
    const [sortCount, setSortCount] = useState(0)
    const [sortName, setSortName] = useState("Sort By")
    const [searchCount, setSearchCount] = useState(2)
    const [searchName, setSearchName] = useState("Find By")
    const [searchData, setSearchData] = useState(originalData)
    const [searching, setSearching] = useState(false)
    const [messageOpacity, setMessageOpacity] = useState("0");
    const [loaded, setLoaded] = useState(false);
    const [deleteSelected, setDeleteSelected] = useState(false)
    const [error, setError] = useState("")

    const uid = localStorage.getItem("uid");

    useEffect(() => {
        if (!uid) return;

        document.getElementById("noData").innerHTML = `Loading your Data<div class="text-loader"></div>`;

        const fetchData = async () => {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const data = userDoc.data().data || [];

                document.getElementById("noData").innerHTML = "Data Loaded.";

                setTimeout(() => {
                    setOriginalData(data);
                    setItemData(data);
                }, 500);

                document.getElementById("downloadImgBtn").style.pointerEvents = "auto"

                setTimeout(() => {
                    document.getElementById("noData").innerHTML = "No Expenses!";
                }, 700);
            }

            setLoaded(true);
        };

        fetchData();
    }, [uid]);

    useEffect(() => {
        if (!uid || !loaded || searching) return;

        const saveData = async () => {
            const userRef = doc(db, "users", uid);
            await setDoc(userRef, { data: itemData }, { merge: true });
        };

        saveData();
    }, [itemData, searching, uid, loaded]);


    // SEARCH

    function searchBy(){
        if(searchCount == 0){ setSearchName("Price"); setSearchCount(1)}
        else if(searchCount == 1){ setSearchName("Date"); setSearchCount(2) }
        // else if(searchCount == 2){ setSearchName("Month"); setSearchCount(3) }
        // else if(searchCount == 3){ setSearchName("Year"); setSearchCount(4) }
        else if(searchCount == 2){ setSearchName("Name"); setSearchCount(0) }
    }

    const searchedData = (value) => {

        if(!value.trim() && itemData.length != 0){
            setSearchData(originalData)
            setMessageOpacity("0")
            return
        }

        const filteredData = originalData.filter((item) => {
            if(searchName == "Name" || searchName == "Find By"){
                return item.itemName.toLowerCase().includes(value.toLowerCase())
            }
            else if (searchName == "Price") {
                return item.itemPrice.includes(value)
            }
            else if (searchName == "Date") {
                return item.itemDate.includes(value)
            }
        })

        if (filteredData.length == 0) { setMessageOpacity("1"); }
        else { setMessageOpacity("0"); }

        setSearchData(filteredData)
    }

    useEffect(() => {
        if (itemData.length == 0) { setMessageOpacity("1"); }
        else { setMessageOpacity("0"); }
    }, [itemData])


    // PARSE-DATE

    function parseDate(date){
        const [day, month, year] = date.split("-")
        return new Date(`${year}-${month}-${day}`)
    }


    // TOTAL

    function totalExpense(){
        let total = 0
        itemData.forEach((item) => {
            let itemValue = 0
            if(item.itemPrice == "None") { itemValue = "0$" } else { itemValue = item.itemPrice }
            const allExpenses = parseFloat(itemValue.replace("$",""))
            total += allExpenses
        })
        return `${total}$`
    }


    // OPEN-MODAL

    function openModal(index, modalName){
        setError("")
        document.getElementById(`modal${modalName}`).style.display = "flex"
        document.getElementById(`modalOverlay${modalName}`).style.display = "flex"
        document.getElementById(`wrapper`).style.filter = "blur(5px)"
        document.getElementById("btnModalAdd").style.opacity = 0.5
        document.getElementById("btnModalAdd").style.pointerEvents = "none"
        document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner1`).style.animation = "none"
        document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner2`).style.animation = "none"
        document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner3`).style.animation = "none"
        document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner4`).style.animation = "none"
        setTimeout(() => {
            document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner1`).style.opacity = 1
            document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner2`).style.opacity = 1
            document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner3`).style.opacity = 1
            document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner4`).style.opacity = 1
        }, 100);
        setTimeout(() => {
            document.getElementById(`modal${modalName}`).style.opacity = "1"
        }, 300);

        document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner1`).style.animation = "0.35s openCorner1 linear forwards"
        document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner2`).style.animation = "0.35s openCorner2 linear forwards"
        document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner3`).style.animation = "0.35s openCorner3 linear forwards"
        document.querySelector(`#modalOverlay${modalName} #menuWrapper #corner4`).style.animation = "0.35s openCorner4 linear forwards"

        if(modalName == "Update"){
            itemData.map((item, itemIndex) => {
                if(itemIndex == index){
                    document.getElementById(`${modalName.toLowerCase()}ModalNameData`).value = ""
                    document.getElementById(`${modalName.toLowerCase()}ModalPriceData`).value = ""
                    document.getElementById(`${modalName.toLowerCase()}ModalDateData`).value = ""
                    document.getElementById(`${modalName.toLowerCase()}ModalNameData`).placeholder = item.itemName.trim();
                    document.getElementById(`${modalName.toLowerCase()}ModalNameData`).setAttribute("data-key", itemIndex)
                    document.getElementById(`${modalName.toLowerCase()}ModalPriceData`).placeholder = item.itemPrice.replace("$","").trim();
                    document.getElementById(`${modalName.toLowerCase()}ModalDateData`).placeholder = item.itemDate
                }
            })
        } else if(modalName == "Add"){
            document.getElementById(`${modalName.toLowerCase()}ModalNameData`).value = ""
            document.getElementById(`${modalName.toLowerCase()}ModalPriceData`).value = ""
            document.getElementById(`${modalName.toLowerCase()}ModalDateData`).value = ""
        } else if(modalName == "Delete"){
            document.getElementById("btnModalDelete").setAttribute("indexKey", index)
            itemData.map((item, itemIndex) => {
            if(itemIndex == index){
                document.getElementById("namePText").textContent = "Name : " + item.itemName
                document.getElementById("pricePText").textContent = "Price : " + item.itemPrice
                document.getElementById("datePText").textContent = "Date : " + item.itemDate
            }
            })
        } else if(modalName == "DeleteAll"){
            setDeleteSelected(false)
            document.getElementById("deleteTitle").innerHTML = "Delete All?"
            if(itemData.length == 0){
                document.getElementById("noDataDelete").style.display = "block"
            } else {
                document.getElementById("noDataDelete").style.display = "none"
            }
        }
    }


    // CLOSE-MODAL

    function closeModal(value, value1){

        selectedItemsListRef.current.forEach((index) => {
            const element = document.getElementById(`item${index}`);
            if (element) element.style.opacity = "1";
        });
        selectedItemsListRef.current = [];

        document.querySelector(`#${value} #menuWrapper #corner1`).style.animation = "none"
        document.querySelector(`#${value} #menuWrapper #corner2`).style.animation = "none"
        document.querySelector(`#${value} #menuWrapper #corner3`).style.animation = "none"
        document.querySelector(`#${value} #menuWrapper #corner4`).style.animation = "none"
        document.querySelector(`#${value} #menuWrapper #corner1`).style.opacity = 1
        document.querySelector(`#${value} #menuWrapper #corner2`).style.opacity = 1
        document.querySelector(`#${value} #menuWrapper #corner3`).style.opacity = 1
        document.querySelector(`#${value} #menuWrapper #corner4`).style.opacity = 1
        document.getElementById(value1).style.opacity = "0"
        setTimeout(() => {
            document.getElementById(value).style.display = "none"
            document.getElementById(value1).style.display = "none"
            document.querySelector(`#${value} #menuWrapper #corner1`).style.animation = "none"
            document.querySelector(`#${value} #menuWrapper #corner2`).style.animation = "none"
            document.querySelector(`#${value} #menuWrapper #corner3`).style.animation = "none"
            document.querySelector(`#${value} #menuWrapper #corner4`).style.animation = "none"
        }, 300);
        document.querySelector(`#${value} #menuWrapper #corner1`).style.animation = "0.35s closeCorner1 linear forwards"
        document.querySelector(`#${value} #menuWrapper #corner2`).style.animation = "0.35s closeCorner2 linear forwards"
        document.querySelector(`#${value} #menuWrapper #corner3`).style.animation = "0.35s closeCorner3 linear forwards"
        document.querySelector(`#${value} #menuWrapper #corner4`).style.animation = "0.35s closeCorner4 linear forwards"

        setTimeout(() => {
            document.querySelector(`#${value} #menuWrapper #corner1`).style.opacity = 0
            document.querySelector(`#${value} #menuWrapper #corner2`).style.opacity = 0
            document.querySelector(`#${value} #menuWrapper #corner3`).style.opacity = 0
            document.querySelector(`#${value} #menuWrapper #corner4`).style.opacity = 0
            document.getElementById("wrapper").style.filter = "blur(0px)"
        }, 300);
    }


    // DELETE-EXPENSE

    function deleteExpense(){
        let value = document.getElementById("btnModalDelete").getAttribute("indexKey")
        setItemData(itemData.filter((newData, index) => index != value))
        closeModal("modalOverlayDelete", "modalDelete")
    }



    // DELETE-SELECTED-EXPENSE

    function deleteSelectedExpense(){
        const indicesToRemove = selectedItemsListRef.current.map(i => parseInt(i));
        const updatedData = itemData.filter((_, itemIndex) => !indicesToRemove.includes(itemIndex));
        
        setItemData(updatedData);

        indicesToRemove.map((data) => {
            const element = document.getElementById(`item` + data);
            if (selectedItemsListRef.current.includes(data)) {
                const pos = selectedItemsListRef.current.indexOf(data);
                if (pos !== -1) selectedItemsListRef.current.splice(pos, 1);
                if (element) element.style.opacity = "1";
            }
        })
        
        selectedItemsListRef.current = [];
        closeModal("modalOverlayDeleteAll", "modalDeleteAll")
    }



    // DELETE-ALL-EXPENSE

    function deleteAllExpense(){
        setItemData([])
        setOriginalData([])
        setSearchData([])
        closeModal("modalOverlayDeleteAll", "modalDeleteAll")
    }


    // ADD-BUTTON-DISABLE

    function addBtnCheck(){
        if(document.getElementById("addModalNameData").value == ""){
            document.getElementById("btnModalAdd").style.opacity = 0.5
            document.getElementById("btnModalAdd").style.pointerEvents = "none"
        } else {
            document.getElementById("btnModalAdd").style.opacity = 1
            document.getElementById("btnModalAdd").style.pointerEvents = "auto"
        }
    }


    // ADD-EXPENSE

    function addExpense(){
        const name = document.getElementById("addModalNameData").value
        const price = document.getElementById("addModalPriceData").value
        const date = document.getElementById("addModalDateData").value

        let nameAddArray = name.split(",")
        let nameAddCheck = nameAddArray.filter((name) => isNaN(name) && isNaN(parseFloat(name)))

        let priceAddArray = price.split(",")
        let priceAddCheck = priceAddArray.filter((price) => {
            if (typeof price === "number") return true;
            if (typeof price === "string") return /^-?\d+(\.\d+)?$/.test(price.trim());
            return false;
        })

        const dateAddFilter = (str) => {
        const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
        if (!regex.test(str)) return false;
        const [day, month, year] = str.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
        };
        let dateAddArray = date.split(",").map((item) => item.trim())
        let validDates;
        if (dateAddArray.length === 1 && dateAddArray[0].endsWith("...")) {
        const singleDate = dateAddArray[0].replace("...", "").trim();
        if (dateAddFilter(singleDate)) {
            validDates = Array(nameAddCheck.length).fill(singleDate);
        } else {
            validDates = Array(nameAddCheck.length).fill("None");
        }
        } else {
        validDates = dateAddArray.filter(dateAddFilter);
        }

        let hasError = false
        const isNameInvalid = name.trim() && nameAddCheck.length === 0;
        const isPriceInvalid = price.trim() && priceAddCheck.length === 0;
        const isDateInvalid = date.trim() && validDates.length === 0;

        if (isNameInvalid){
            hasError= true
            setError("Name Error!");
            return;
        } else if(isPriceInvalid){
            hasError= true
            setError("Price Error!");
            return;
        } else if(isDateInvalid) {
            hasError= true
            setError("Date Error!");
            return;
        }

        const newItems = nameAddCheck.map((name, index) => ({
        itemName: name || "None",
        itemPrice: priceAddCheck[index] ? `${priceAddCheck[index]}$` : "None",
        itemDate: validDates[index] || "None"
        }));

        if(hasError == false){
            setItemData(prev => [...prev, ...newItems]);
            closeModal("modalOverlayAdd", "modalAdd")
        }
    }


    // UPDATE-EXPENSE

    function updateExpense(){
        const name = document.getElementById("updateModalNameData").value
        const price = document.getElementById("updateModalPriceData").value
        let date = document.getElementById("updateModalDateData").value

        const dataKey = document.getElementById("updateModalNameData").getAttribute("data-key")
        const indexToUpdate = parseInt(dataKey)

        let nameCheck
        if(isNaN(name) && isNaN(parseFloat(name))){
            nameCheck = name
        }

        let priceCheck;
        if (typeof price === "number"){
            priceCheck = parseFloat(price)
        } else if (typeof price === "string" && /^-?\d+(\.\d+)?$/.test(price.trim())) {
            priceCheck = parseFloat(price.trim())
        }

        const originalItem = itemData[indexToUpdate]
        const isValid = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(date)
        if(!isValid){
            date = originalItem.itemDate
        }

        const updatedItem = {
            itemName: nameCheck || originalItem.itemName,
            itemPrice: priceCheck ? `${priceCheck}$` : originalItem.itemPrice,
            itemDate: date || originalItem.itemDate
        }

        const updatedData = [...itemData]
        updatedData[indexToUpdate] = updatedItem
        setItemData(updatedData)
        closeModal("modalOverlayUpdate", "modalUpdate")
    }


    // SORT

    useEffect(() => {
        let sortSaved = JSON.parse(localStorage.getItem("sortPreference"))
        if(sortSaved){
            setSortName(sortSaved.sortValue)
            setSortCount(sortSaved.sortNumber)
        }
    }, [])

    function sortBy(){
        const sorted = [...itemData]

        if(sortCount == 0){
            setSortName("A-Z")
            setSortCount(1)
            sorted.sort((a,b) => a.itemName.localeCompare(b.itemName))
            const sortPreference = {
                sortNumber: 1,
                sortValue: "A-Z"
            }
            localStorage.setItem("sortPreference", JSON.stringify(sortPreference))
            setItemData(sorted)
        } else if(sortCount == 1){
            setSortName("Z-A")
            setSortCount(2)
            sorted.sort((a,b) => b.itemName.localeCompare(a.itemName))
            const sortPreference = {
                sortNumber: 2,
                sortValue: "Z-A"
            }
            localStorage.setItem("sortPreference", JSON.stringify(sortPreference))
            setItemData(sorted)
        } else if(sortCount == 2){
            setSortName("0-1")
            setSortCount(3)
            sorted.sort((a, b) => a.itemPrice.replace("$","") - b.itemPrice.replace("$",""))
            const sortPreference = {
                sortNumber: 3,
                sortValue: "0-1"
            }
            localStorage.setItem("sortPreference", JSON.stringify(sortPreference))
            setItemData(sorted)
        } else if(sortCount == 3){
            setSortName("1-0")
            setSortCount(4)
            sorted.sort((a, b) => b.itemPrice.replace("$","") - a.itemPrice.replace("$",""))
            const sortPreference = {
                sortNumber: 4,
                sortValue: "1-0"
            }
            localStorage.setItem("sortPreference", JSON.stringify(sortPreference))
            setItemData(sorted)
        } else if(sortCount == 4){
            setSortName("00-00-0000")
            setSortCount(5)
            sorted.sort((a, b) => parseDate(a.itemDate) - parseDate(b.itemDate))
            const sortPreference = {
                sortNumber: 5,
                sortValue: "00-00-0000"
            }
            localStorage.setItem("sortPreference", JSON.stringify(sortPreference))
            setItemData(sorted)
        } else if(sortCount == 5){
            setSortName("11-11-1111")
            setSortCount(0)
            sorted.sort((a, b) => parseDate(b.itemDate) - parseDate(a.itemDate))
            const sortPreference = {
                sortNumber: 0,
                sortValue: "11-11-1111"
            }
            localStorage.setItem("sortPreference", JSON.stringify(sortPreference))
            setItemData(sorted)
        }
    }


    // SYMMETRY

    let topBarButtonsWidth1
    let topBarButtonsWidth2
    let topBarButtonsWidth3
    const getScreenWidth = () => {
        if(window.innerWidth <= 450){
            topBarButtonsWidth1 = "6em"
            topBarButtonsWidth2 = "6em"
            topBarButtonsWidth3 = "7.75em"
        } else {
            topBarButtonsWidth1 = "2.75em"
            topBarButtonsWidth2 = "5em"
            topBarButtonsWidth3 = "8.75em"
        }
    }
    getScreenWidth()


    // KEYBOARD

    const [keyboardMode, setKeyboardMode] = useState(false);
    const keyboardModeRef = useRef(false);

    useEffect(() => {
        keyboardModeRef.current = keyboardMode;
    }, [keyboardMode]);

    useEffect(() => {
        const handleKeyDown = (event) => {
        const updateModal = document.getElementById("modalOverlayUpdate");
        const addModal = document.getElementById("modalOverlayAdd");
        const deleteModal = document.getElementById("modalOverlayDelete");
        const infoModal = document.getElementById("modalOverlayInfo");
        const deleteAllModal = document.getElementById("modalOverlayDeleteAll");
        const logoutModal = document.getElementById("modalOverlayLogout");

        const modalVisible =
            updateModal?.style.display === "flex" || addModal?.style.display === "flex" || deleteModal?.style.display === "flex" || infoModal?.style.display === "flex" || deleteAllModal?.style.display === "flex" || logoutModal?.style.display === "flex";

        let focusScope = document;
        if (updateModal?.style.display === "flex") {
            focusScope = updateModal;
        } else if (addModal?.style.display === "flex") {
            focusScope = addModal;
        } else if (deleteModal?.style.display === "flex") {
            focusScope = deleteModal;
        } else if (infoModal?.style.display === "flex") {
            focusScope = infoModal;
        } else if (deleteAllModal?.style.display === "flex") {
            focusScope = deleteAllModal;
        } else if (logoutModal?.style.display === "flex") {
            focusScope = logoutModal;
        }

        const getFocusable = () => Array.from(focusScope.querySelectorAll('[tabindex="0"]'));

        const activeElement = document.activeElement;
        const isTyping =
            activeElement &&
            (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.isContentEditable);

        if (!modalVisible && !isTyping) {
            if (event.key.toLowerCase() === "a") {
                const button = document.getElementById("btnAddOpen");
                if (button) button.click();
            }
            if (event.key.toLowerCase() === "p") {
                const button = document.getElementById("btnDownloadImg");
                if (button) button.click();
            }
            if (event.key.toLowerCase() === "f") {
                const button = document.getElementById("findBtn");
                if (button) button.click();
            }
            if (event.key.toLowerCase() === "s") {
                const button = document.getElementById("sortBtn");
                if (button) button.click();
            }
            if (event.key.toLowerCase() === "t") {
                const button = document.getElementById("themeBtn");
                if (button) button.click();
            }
            if (event.key.toLowerCase() === "i") {
                const button = document.getElementById("infoBtn");
                if (button) button.click();
            }
            if (event.key.toLowerCase() === "l") {
                const button = document.getElementById("btnLogoutOpen");
                if (button) button.click();
            }
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
                event.preventDefault();
                const button = document.getElementById("btnDeleteAllOpen");
                if (button) button.click();
            }
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                const inputFocus = document.getElementById("findInput");
                if (inputFocus) inputFocus.focus();
            }
        }

        if (event.key === "Enter" && !event.shiftKey && !keyboardModeRef.current) {
            if (updateModal?.style.display === "flex") {
            const button = document.getElementById("btnModalUpdate");
            if (button) button.click();
            } else if (addModal?.style.display === "flex") {
            const button = document.getElementById("btnModalAdd");
            if (button) button.click();
            } else if (deleteModal?.style.display === "flex") {
            const button = document.getElementById("btnModalDelete");
            if (button) button.click();
            } else if (deleteAllModal?.style.display === "flex") {
            const button = document.getElementById("btnModalDeleteAll");
            if (button) button.click();
            } else if (logoutModal?.style.display === "flex") {
            const button = document.getElementById("btnModalLogout");
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

        if (event.key === "Enter" && !event.shiftKey && keyboardModeRef.current) {
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

            if (updateModal?.style.display === "flex") {
            const button = document.getElementById("cancelBtnUpdate");
            if (button) button.click();
            } else if (addModal?.style.display === "flex") {
            const button = document.getElementById("cancelBtnAdd");
            if (button) button.click();
            } else if (deleteModal?.style.display === "flex") {
            const button = document.getElementById("cancelBtnDelete");
            if (button) button.click();
            } else if (infoModal?.style.display === "flex") {
            const button = document.getElementById("cancelBtnInfo");
            if (button) button.click();
            } else if (deleteAllModal?.style.display === "flex") {
            const button = document.getElementById("cancelBtnDeleteAll");
            if (button) button.click();
            } else if (logoutModal?.style.display === "flex") {
            const button = document.getElementById("cancelBtnLogout");
            if (button) button.click();
            }
        }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
        }, []);

    const navigate = useNavigate();
    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("loggedInUsername");
        closeModal("modalOverlayLogout", "modalLogout");
        setTimeout(() => {
            navigate("/Login");
        }, 300);
    };


    // SAVE-IMAGE

    const downloadImage = async () => {
    const element = document.getElementById('hidden-img-content');

    document.getElementById("downloadImgBtn").style.pointerEvents = "none"
    document.getElementById("imgBtn").style.display = "none"
    document.getElementById("text-loader-img").style.display = "block"

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
        });
    }

    try {
        const canvas = await window.html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2
        });

        const imgData = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'Expense-Data.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        document.getElementById("downloadImgBtn").style.pointerEvents = "auto"
        document.getElementById("text-loader-img").style.display = "none"
        document.getElementById("imgBtn").style.display = "block" 
    } catch (error) {
        console.error('Error saving image:', error);
        alert('Failed to save image. Please try again.');
    }
    };


    // SELECTED

    const selectedItemsListRef = useRef([]);
    function selectItem(index) {
        const element = document.getElementById(`item` + index);

        if (!selectedItemsListRef.current.includes(index)) {
            selectedItemsListRef.current.push(index);
            if (element) element.style.opacity = "0.5";
        } else {
            const pos = selectedItemsListRef.current.indexOf(index);
            if (pos !== -1) selectedItemsListRef.current.splice(pos, 1);
            if (element) element.style.opacity = "1";
        }
        document.getElementById("deleteTitle").innerHTML = "Delete Selected?"

        if(selectedItemsListRef.current.length > 0){
            setDeleteSelected(true)
        } else {
            setDeleteSelected(false)
            document.getElementById("deleteTitle").innerHTML = "Delete All?"
        }
    }

    const username = localStorage.getItem("loggedInUsername")


    return(
        <>
        <div className="wrapper" id="wrapper">
            <div className="main" id="main">
                <div className="topBar">
                    <h1>Expense Data</h1>
                    <div className="topBarBtns">
                        <NButton btnID={"infoBtn"} clickData={() => openModal(null, "Info")} width={topBarButtonsWidth1} btnName={"i"}/>
                        <ThemeToggle btnWidth={topBarButtonsWidth2} displayMode={"flex"} />
                    </div>
                </div>
                <div className="search">
                    <input tabIndex={0} autoComplete="off" placeholder="Find Expenses" onFocus={() => setSearching(true)} onBlur={() => setSearching(false)} id="findInput" onChange={(e) => searchedData(e.target.value)}/>
                    <div className="searchBtns">
                        <NButton btnID={"findBtn"} clickData={searchBy} width={topBarButtonsWidth3} btnName={searchName}/>
                    </div>
                </div>
                <div className="sortBtns">
                    <span className="userNameWrapper">[<span className="userName" title={username}>{username}</span>]</span>
                    <NButton btnID={"sortBtn"} clickData={sortBy} width={"7.75em"} btnName={sortName}/>
                </div>
                <div className="dataItems">
                    <div className="noData" id="noData" style={{ opacity: messageOpacity }}>No Expenses!</div>
                    {(searching ? searchData : itemData).map((item, index) => (
                    <React.Fragment key={index}>
                    <div className="item">
                        <div className="itemData">
                            <span className="itemIndex" style={{ textWrap: "nowrap" }}>[ {index} ]</span>
                            <span className="itemName" title={item.itemName} style={{ userSelect: "none", maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.itemName}</span>
                            <span style={{ fontWeight: "bold" }} className="itemExpense">- {item.itemPrice}</span>
                        </div>
                        <div className="dataBtns">
                            <span className="itemDate">{item.itemDate}</span>
                            <NButton clickData={() => openModal(index, "Update")} width={"7em"} btnName={"Update"} />
                            <NButton clickData={() => openModal(index, "Delete")} width={"7em"} btnName={"Delete"} />
                        </div>
                    </div>
                    <div className="divider"></div>
                    </React.Fragment>
                    ))}
                </div>
            </div>
            <div className="bottomBar">
                <div className="total">
                    <span>TOTAL : <span style={{ fontWeight: "bold" }}>{totalExpense()}</span></span>
                </div>
                <div className="bBtns">
                    <div className="logoutBtn">
                        <NButton btnID={`btnLogoutOpen`} clickData={() => openModal(null, "Logout")} width={"100%"} height={"2.5em"} btnName={"Logout"} />
                    </div>
                    <div className="deleteAllBtn">
                        <NButton btnID={`btnDeleteAllOpen`} clickData={() => openModal(null, "DeleteAll")} width={"100%"} height={"2.5em"} btnName={"Delete"} />
                    </div>
                    <div className="addItemBtn">
                        <NButton btnID={`btnAddOpen`} clickData={() => openModal(null, "Add")} width={"100%"} height={"2.5em"} btnName={"Add"} />
                    </div>
                    <div className="downloadImgBtn" id="downloadImgBtn">
                        <div id="imgBtn" style={{ width: "100%" }}>
                        <NButton btnID={`btnDownloadImg`} clickData={downloadImage} width={"100%"} height={"2.5em"} btnName={"Image"} />
                        </div>
                        <div className="text-loader" id="text-loader-img"></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="modalOverlay" id="modalOverlayUpdate">
            <div className="menuWrapper" id="menuWrapper">
                <div className="corner1" id="corner1"></div>
                <div className="corner2" id="corner2"></div>
                <div className="corner3" id="corner3"></div>
                <div className="corner4" id="corner4"></div>
                <div className="modal" id="modalUpdate">
                    <h1>Update Expense</h1>
                    <input tabIndex={0} autoComplete="off" id="updateModalNameData" type="text" />
                    <input tabIndex={0} autoComplete="off" id="updateModalPriceData" type="text" />
                    <input tabIndex={0} autoComplete="off" id="updateModalDateData" type="text" />
                    <p style={{ fontSize: "0.8em", opacity: "0.5" }}>{error}</p>
                    <div className="modalBtns">
                        <NButton clickData={() => closeModal("modalOverlayUpdate", "modalUpdate")} width={"7em"} btnID={"cancelBtnUpdate"} btnName={"Cancel"} />
                        <NButton clickData={updateExpense} btnID={`btnModalUpdate`} width={"7em"} btnName="Update"/>
                    </div>
                </div>
            </div>
        </div>
        <div className="modalOverlay" id="modalOverlayAdd">
            <div className="menuWrapper" id="menuWrapper">
                <div className="corner1" id="corner1"></div>
                <div className="corner2" id="corner2"></div>
                <div className="corner3" id="corner3"></div>
                <div className="corner4" id="corner4"></div>
                <div className="modal" id="modalAdd">
                    <h1>Add Expense</h1>
                    <textarea tabIndex={0} autoComplete="off" id="addModalNameData" type="text" placeholder="Name" onChange={addBtnCheck} />
                    <textarea tabIndex={0} autoComplete="off" id="addModalPriceData" type="text" placeholder="Price" onChange={addBtnCheck} />
                    <textarea tabIndex={0} autoComplete="off" id="addModalDateData" type="text" placeholder="Date[DD-MM-YYYY]" onChange={addBtnCheck} />
                    <p style={{ fontSize: "0.8em", opacity: "0.5" }}>{error}</p>
                    <div className="modalBtns">
                        <NButton clickData={() => closeModal("modalOverlayAdd", "modalAdd")} width={"7em"} btnID={"cancelBtnAdd"} btnName={"Cancel"} />
                        <NButton clickData={addExpense} btnID={`btnModalAdd`} width={"7em"} btnName="Add"/>
                    </div>
                </div>
            </div>
        </div>
        <div className="modalOverlay" id="modalOverlayDelete">
            <div className="menuWrapper" id="menuWrapper">
                <div className="corner1" id="corner1"></div>
                <div className="corner2" id="corner2"></div>
                <div className="corner3" id="corner3"></div>
                <div className="corner4" id="corner4"></div>
                <div className="modal" id="modalDelete">
                    <h1>Delete Expense?</h1>
                    <div className="deleteData">
                        <p id="namePText"></p>
                        <p id="pricePText"></p>
                        <p id="datePText"></p>
                    </div>
                    <div className="modalBtns">
                        <NButton clickData={() => closeModal("modalOverlayDelete", "modalDelete")} width={"7em"} btnID={"cancelBtnDelete"} btnName={"Cancel"} />
                        <NButton clickData={() => deleteExpense()} btnID={`btnModalDelete`} width={"7em"} btnName="Delete"/>
                    </div>
                </div>
            </div>
        </div>
        <div className="modalOverlay" id="modalOverlayDeleteAll">
            <div className="menuWrapper" id="menuWrapper">
                <div className="corner1" id="corner1"></div>
                <div className="corner2" id="corner2"></div>
                <div className="corner3" id="corner3"></div>
                <div className="corner4" id="corner4"></div>
                <div className="modal" id="modalDeleteAll">
                    <h1 id="deleteTitle"></h1>
                    <p style={{ opacity: "0.5", fontSize: "0.75em", marginTop: "-1.25em" }}>Click items to delete the selected ones.</p>
                    <div className="deleteAllData" id="deleteAllData">
                        <div className="noData" id="noDataDelete" style={{ width: "auto",height: "auto", margin: "auto" }}>No Expenses to delete!</div>
                        {(itemData).map((deleteItem, deleteItemIndex) => (
                            <>
                            <div className="selectableItem" id={`item${deleteItemIndex}`} onClick={() => selectItem(deleteItemIndex)}>
                                <p id="namePText">Name : {deleteItem.itemName}</p>
                                <p id="pricePText">Price : {deleteItem.itemPrice}</p>
                                <p id="datePText">Date : {deleteItem.itemDate}</p>
                            </div>
                            <div className="divider1"></div>
                            </>
                        ))}
                    </div>
                    <div className="modalBtns">
                        <NButton clickData={() => closeModal("modalOverlayDeleteAll", "modalDeleteAll")} width={"7em"} btnID={"cancelBtnDeleteAll"} btnName={"Cancel"} />
                        <NButton clickData={deleteSelected ? deleteSelectedExpense : deleteAllExpense} btnID={`btnModalDeleteAll`} width={"7em"} btnName="Delete"/>
                    </div>
                </div>
            </div>
        </div>
        <div className="modalOverlay" id="modalOverlayInfo">
            <div className="menuWrapper" id="menuWrapper">
                <div className="corner1" id="corner1"></div>
                <div className="corner2" id="corner2"></div>
                <div className="corner3" id="corner3"></div>
                <div className="corner4" id="corner4"></div>
                <div className="modal" id="modalInfo">
                    <h1>Info</h1>
                    <div className="infoData" style={{ fontSize: "0.85em" }}>
                        <div style={{ marginBottom: "0.5em" }}>KeyBoard Shortcuts</div>
                        <div style={{ padding: "1em", backgroundColor:"var(--color10)", display: "flex", gap: "0.5em", flexDirection: "column" }}>
                            <li><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", marginBottom: "0.5em" }}>i</span> : Open Info</li>
                            <li><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", marginBottom: "0.5em" }}>t</span> : Toggle Theme</li>
                            <li><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", marginBottom: "0.5em" }}>f</span> : Toggle "Find By"</li>
                            <li><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", marginBottom: "0.5em" }}>s</span> : Toggle "Sort By"</li>
                            <li><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", marginBottom: "0.5em" }}>a</span> : Open Add Expense</li>
                            <li><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", marginBottom: "0.5em" }}>p</span> : Save Image</li>
                            <li><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", marginBottom: "0.5em" }}>l</span> : Logout</li>
                            <li><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", marginBottom: "0.5em" }}>ctrl + k</span> : Find</li>
                            <li><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", marginBottom: "0.5em" }}>ctrl + d</span> : Delete All</li>
                            <li><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", marginBottom: "0.5em" }}>ESC</span> : Back</li>
                        </div>
                        <li style={{ marginTop: "1em", lineHeight: "1.75em" }}>Use <span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", margin: "0.5em 0.5em 0.5em 0" }}>⟵</span><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", margin: "0.5em 0.5em 0.5em 0" }}>↑</span><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", margin: "0.5em 0.5em 0.5em 0" }}>⟶</span><span style={{ padding: "0.15em 0.5em 0.15em 0.5em", backgroundColor: "var(--color7)", margin: "0.5em 0 0.5em 0" }}>↓</span>  Arrow keys to navigate through the whole page.</li>
                        <li style={{ marginTop: "0.5em"}}>You can also add multiple values at once while adding expenses by Seperating them with a Coma[","]. Example Usage : Rent, Groceries, Bills | 250, 100, 350 | 01-05-2025, 12-06-2025, 25-06-2025</li>
                        <li style={{ marginTop: "0.5em", marginBottom: "1em" }}>If you want to assign same date to multiple expenses while adding, Then just write the date ending it with 3 dots["..."]. After doing this the same date will be assigned to all newly added items at once. Example Usage : 01-12-2025...</li>
                        <NButton clickData={() => window.open("https://github.com/Praashoo7/Expense-Data", "_blank")} width={"100%"} height={"2.5em"} btnName={"Star on Github"} />
                    </div>
                    <div className="modalBtns">
                        <NButton clickData={() => closeModal("modalOverlayInfo", "modalInfo")} width={"7em"} btnID={"cancelBtnInfo"} btnName={"Close"} />
                    </div>
                </div>
            </div>
        </div>
        <div className="modalOverlay" id="modalOverlayLogout">
            <div className="menuWrapper" id="menuWrapper">
                <div className="corner1" id="corner1"></div>
                <div className="corner2" id="corner2"></div>
                <div className="corner3" id="corner3"></div>
                <div className="corner4" id="corner4"></div>
                <div className="modal" id="modalLogout">
                    <h1>Logout?</h1>
                    <div className="logoutData" id="logoutData"></div>
                    <div className="modalBtns">
                        <NButton clickData={() => closeModal("modalOverlayLogout", "modalLogout")} width={"7em"} btnID={"cancelBtnLogout"} btnName={"Cancel"} />
                        <NButton clickData={handleLogout} btnID={`btnModalLogout`} width={"7em"} btnName="Logout"/>
                    </div>
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
        <div className="pdfContent" id="hidden-img-content">
            <span className="userNameWrapperPDF">[<span className="userNamePDF" title={username}>{username}</span>]</span>
            <div className="divider1" style={{ margin: "0 0 1em 0" }}></div>
            {(itemData).map((item, index) => (
                <React.Fragment key={index}>
                    <div className="itemPDF">
                        <div className="itemDataPDF">
                            <span className="itemIndexPDF" style={{ textWrap: "noWrap" }}>[ {index} ]</span>
                            <div className="itemNamePDF">{item.itemName}</div>
                            <span style={{ fontWeight: "bold" }} className="itemExpensePDF">- {item.itemPrice}</span>
                        </div>
                        <div className="dataBtnsPDF">
                            <span className="itemDatePDF">{item.itemDate}</span>
                        </div>
                    </div>
                </React.Fragment>
            ))}
            <div className="totalPDF">
                <span>TOTAL : <span style={{ fontWeight: "bold" }}>{totalExpense()}</span></span>
            </div>
        </div>
        </>
    )
}

export default CRUD