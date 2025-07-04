import React, { useState, useMemo, useRef, useEffect } from "react";
import { useLocation } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import NButton from "./NButton";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

const Stats = ({ statsData = [] }) => {
  const [chartView, setChartView] = useState("month");
  const location = useLocation();
  const sampleData = location.state?.statsData || [];

  const allData = useMemo(() => statsData.length > 0 ? statsData : sampleData, [statsData, sampleData]);

  const processedDataToUse = useMemo(() => {
    return allData.map(item => {
      let price = 0;
      if (item.itemPrice && item.itemPrice !== 'None') {
        if (item.itemPrice.includes('-')) {
          price = 0;
        } else {
          price = parseFloat(item.itemPrice.replace(/[^\d.-]/g, '')) || 0;
        }
      }

      let date = null;
      if (item.itemDate && item.itemDate !== 'None') {
        date = item.itemDate;
      } else if (item.itemPrice && item.itemPrice !== 'None' && item.itemPrice.includes('-')) {
        date = item.itemPrice;
      }

      const name = item.itemName ? item.itemName.replace(/^\n/, '').trim() : '';

      let parsedDate = null;
      if (date) {
        const parts = date.split('-');
        if (parts.length === 3) {
          parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }

      return {
        ...item,
        cleanPrice: price,
        cleanDate: parsedDate,
        cleanName: name,
        year: parsedDate ? parsedDate.getFullYear() : null,
        month: parsedDate ? parsedDate.getMonth() + 1 : null,
        day: parsedDate ? parsedDate.getDate() : null
      };
    }).filter(item => item.cleanName && (item.cleanPrice > 0 || item.cleanDate)); // Keep items with valid name and either price or date
  }, [allData]);

  const statsToUse = useMemo(() => {
    if (processedDataToUse.length === 0) return null;

    const validExpenseItems = processedDataToUse.filter(item => item.cleanPrice > 0);

    if (validExpenseItems.length === 0) {
      return {
        highestExpense: null,
        highestYear: { year: null, amount: 0 },
        highestMonth: { month: null, amount: 0 },
        highestDay: { day: null, amount: 0 },
        yearlyExpenses: {},
        monthlyExpenses: {},
        dailyExpenses: {}
      };
    }

    const highestExpense = validExpenseItems.reduce((max, item) => item.cleanPrice > max.cleanPrice ? item : max);

    const yearlyExpenses = {}, monthlyExpenses = {}, dailyExpenses = {};

    validExpenseItems.forEach(item => {
      if (item.year) yearlyExpenses[item.year] = (yearlyExpenses[item.year] || 0) + item.cleanPrice;
      if (item.year && item.month) {
        const key = `${item.year}-${String(item.month).padStart(2, '0')}`;
        monthlyExpenses[key] = (monthlyExpenses[key] || 0) + item.cleanPrice;
      }
      if (item.cleanDate) {
        const key = item.cleanDate.toISOString().split('T')[0];
        dailyExpenses[key] = (dailyExpenses[key] || 0) + item.cleanPrice;
      }
    });

    const highestYear = Object.entries(yearlyExpenses).reduce((max, [year, amount]) => amount > max.amount ? { year, amount } : max, { year: null, amount: 0 });
    const highestMonth = Object.entries(monthlyExpenses).reduce((max, [month, amount]) => amount > max.amount ? { month, amount } : max, { month: null, amount: 0 });
    const highestDay = Object.entries(dailyExpenses).reduce((max, [day, amount]) => amount > max.amount ? { day, amount } : max, { day: null, amount: 0 });

    return { highestExpense, highestYear, highestMonth, highestDay, yearlyExpenses, monthlyExpenses, dailyExpenses };
  }, [processedDataToUse]);

  const chartDataToUse = useMemo(() => {
    if (!statsToUse) return [];
    switch (chartView) {
      case "year":
        return Object.entries(statsToUse.yearlyExpenses).map(([year, amount]) => ({ period: year, amount })).sort((a, b) => a.period.localeCompare(b.period));
      case "month":
        return Object.entries(statsToUse.monthlyExpenses).map(([month, amount]) => {
          const [y, m] = month.split('-');
          const date = new Date(y, m - 1);
          return { period: `${date.toLocaleString('default', { month: 'short' })} ${y}`, amount, sortKey: month };
        }).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
      case "day":
        return Object.entries(statsToUse.dailyExpenses).map(([day, amount]) => {
          const d = new Date(day);
          return { period: day, display: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), amount, sortKey: day };
        }).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
      default:
        return [];
    }
  }, [statsToUse, chartView]);



  // NO-STATS

  if (!statsToUse) {
    return (
      <div style={{ color: "var(--color4)", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
        <div style={{ border: "1px solid var(--color7)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1em", padding: "2em" }}>
          <h1>Stats</h1>
          <p style={{ marginBottom: "1em" }}>No valid Expense data available.</p>
          <NButton clickData={() => handleBack()} width={"100%"} btnName={"Back"}/>
        </div>
      </div>
    );
  }



  // SYMMETRY

  let topBarButtonsWidth1
  let topBarButtonsWidth2
  let topBarButtonsWidth3
  const getScreenWidth = () => {
      if(window.innerWidth <= 550){
          topBarButtonsWidth1 = "100%"
          topBarButtonsWidth2 = "100%"
      } else {
          topBarButtonsWidth1 = "5em"
          topBarButtonsWidth2 = "5em"
      }
      if(window.innerWidth <= 450){
          topBarButtonsWidth3 = "7.75em"
      } else {
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


        
  // SAVE-IMAGE

  const downloadImage = async () => {
  const element = document.getElementById('statsWrapperImg');

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
      link.download = 'Expense-Data-Stats.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      document.getElementById("downloadImgBtn").style.pointerEvents = "auto"
      document.getElementById("text-loader-img").style.display = "none"
      document.getElementById("imgBtn").style.display = "flex" 
  } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
  }
  };

  const username = localStorage.getItem("loggedInUsername")
  const navigate = useNavigate();
  function handleBack(){
      navigate(`/${username}`);
  }

  const totalExpense = processedDataToUse.reduce((sum, item) => sum + item.cleanPrice, 0);

  return (
    <>
    <div className="statsWrapper">
        <div className="topBar topBarChart">
            <h1>Expense Stats</h1>
            <div className="topBarBtns topBarBtnsChart">
                <NButton clickData={() => handleBack()} width={topBarButtonsWidth1} btnName={"Back"}/>
                <ThemeToggle btnWidth={topBarButtonsWidth2} displayMode={"flex"} />
            </div>
        </div>
      
      {/* Statistics Cards */}
      <div className="statsHighestWrapper">
        <div className="statsHighestExpense">
          <h3 className="statsHighestExpenseTitle">Highest Expense</h3>
          <p className="statsHighestExpensePrice">
            ${statsToUse.highestExpense.cleanPrice.toFixed(2)}
          </p>
          <p className="statsHighestExpenseName">
            {statsToUse.highestExpense?.cleanName?.trim()
            ? statsToUse.highestExpense.cleanName
            : "None"}
          </p>
          <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
        </div>

        <div className="statsHighestExpense">
          <h3 className="statsHighestExpenseTitle">Highest Year</h3>
          <p className="statsHighestExpensePrice">
            ${statsToUse.highestYear.amount.toFixed(2)}
          </p>
          <p className="statsHighestExpenseName">
            {statsToUse.highestYear?.year?.trim() ? statsToUse.highestYear.year : "None"}
          </p>
          <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
        </div>

        <div className="statsHighestExpense">
          <h3 className="statsHighestExpenseTitle">Highest Month</h3>
          <p className="statsHighestExpensePrice">
            ${statsToUse.highestMonth.amount.toFixed(2)}
          </p>
          <p className="statsHighestExpenseName">
            {statsToUse.highestMonth?.month
            ? new Date(statsToUse.highestMonth.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'None'}
          </p>
          <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
        </div>

        <div className="statsHighestExpense">
          <h3 className="statsHighestExpenseTitle">Highest Day</h3>
          <p className="statsHighestExpensePrice">
            ${statsToUse.highestDay.amount.toFixed(2)}
          </p>
          <p className="statsHighestExpenseName">
            {(statsToUse.highestDay?.day || '').trim()
            ? new Date(statsToUse.highestDay.day).toLocaleDateString()
            : 'None'}
          </p>
          <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
        </div>

        <div className="statsHighestExpense">
            <h3 className="statsHighestExpenseTitle">Total Expense</h3>
            <p className="statsHighestExpensePrice">
            ${totalExpense.toFixed(2)}
            </p>
            <p className="statsHighestExpenseName">
                Till {new Date().toLocaleDateString()}
            </p>
          <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="chartTop">
        <h2>Expenses Over Time</h2>
        <div style={{ display: "flex", gap: "1em", flexWrap: "wrap", textTransform: "capitalize" }}>
          {["year", "month", "day"].map((view) => (
            <NButton clickData={() => setChartView(view)} btnName={view} width={"5em"} />
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ 
        width: "100%",
        height: "400px", 
        background: "var(--color13)", 
        padding: "2em 2em 1em 0.5em",
        border: "1px solid var(--color7)",
        position: "relative"
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartDataToUse}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color7)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color4)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color4)"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
            contentStyle={{
                backgroundColor: "var(--color13)",
                border: "1px solid var(--color7)",
                color: "var(--color4)",
                padding: "0.75em 1em 0.5em 1em"
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
            labelFormatter={(_, payload) => {
                if (payload && payload[0]?.payload?.period) {
                const date = new Date(payload[0].payload.period);
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
                }
                return '';
            }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="var(--color4)"
              strokeWidth={2}
              dot={{ fill: "var(--color4)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="cornerBtnE11"></div>
        <div className="cornerBtnE12"></div>
        <div className="cornerBtnE13"></div>
        <div className="cornerBtnE14"></div>
      </div>
      <div className="downloadImgBtnChartWrap">
        <div className="downloadImgBtn downloadImgBtnChart" id="downloadImgBtn">
            <div id="imgBtn" style={{ width: "100%" }}>
            <NButton btnID={`btnDownloadImg`} clickData={downloadImage} width={"100%"} height={"2.5em"} btnName={"Image"} />
            </div>
            <div className="text-loader" id="text-loader-img"></div>
        </div>
    </div>
    </div>
    <div className="statsWrapper statsWrapperImg" tabIndex={-1} id="statsWrapperImg">
        <div className="topBar">
            <h1>Expense Stats</h1>
        </div>
      
      {/* Statistics Cards */}
      <div className="statsHighestWrapper">
        <div className="statsHighestExpense">
          <h3 className="statsHighestExpenseTitle">Highest Expense</h3>
          <p className="statsHighestExpensePrice">
            ${statsToUse.highestExpense.cleanPrice.toFixed(2)}
          </p>
          <p className="statsHighestExpenseName">
            {statsToUse.highestExpense?.cleanName?.trim()
            ? statsToUse.highestExpense.cleanName
            : "None"}
          </p>
          <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
        </div>

        <div className="statsHighestExpense">
          <h3 className="statsHighestExpenseTitle">Highest Year</h3>
          <p className="statsHighestExpensePrice">
            ${statsToUse.highestYear.amount.toFixed(2)}
          </p>
          <p className="statsHighestExpenseName">
            {statsToUse.highestYear?.year?.trim() ? statsToUse.highestYear.year : "None"}
          </p>
          <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
        </div>

        <div className="statsHighestExpense">
          <h3 className="statsHighestExpenseTitle">Highest Month</h3>
          <p className="statsHighestExpensePrice">
            ${statsToUse.highestMonth.amount.toFixed(2)}
          </p>
          <p className="statsHighestExpenseName">
            {statsToUse.highestMonth?.month
            ? new Date(statsToUse.highestMonth.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'None'}
          </p>
          <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
        </div>

        <div className="statsHighestExpense">
          <h3 className="statsHighestExpenseTitle">Highest Day</h3>
          <p className="statsHighestExpensePrice">
            ${statsToUse.highestDay.amount.toFixed(2)}
          </p>
          <p className="statsHighestExpenseName">
            {(statsToUse.highestDay?.day || '').trim()
            ? new Date(statsToUse.highestDay.day).toLocaleDateString()
            : 'None'}
          </p>
          <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
        </div>

        <div className="statsHighestExpense">
            <h3 className="statsHighestExpenseTitle">Total Expense</h3>
            <p className="statsHighestExpensePrice">
            ${totalExpense.toFixed(2)}
            </p>
            <p className="statsHighestExpenseName">
                Till {new Date().toLocaleDateString()}
            </p>
          <div className="cornerBtnE11"></div>
          <div className="cornerBtnE12"></div>
          <div className="cornerBtnE13"></div>
          <div className="cornerBtnE14"></div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="chartTop">
        <h2>Expenses Over Time</h2>
      </div>

      {/* Chart */}
      <div style={{ 
        width: "100%",
        height: "400px", 
        background: "var(--color13)", 
        padding: "2em 2em 1em 0.5em",
        border: "1px solid var(--color7)",
        position: "relative"
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartDataToUse}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color7)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color4)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color4)"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
            contentStyle={{
                backgroundColor: "var(--color13)",
                border: "1px solid var(--color7)",
                color: "var(--color4)",
                padding: "0.75em 1em 0.75em 1em"
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
            labelFormatter={(_, payload) => {
                if (payload && payload[0]?.payload?.period) {
                const date = new Date(payload[0].payload.period);
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
                }
                return '';
            }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="var(--color4)"
              strokeWidth={2}
              dot={{ fill: "var(--color4)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
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
  );
};

export default Stats;