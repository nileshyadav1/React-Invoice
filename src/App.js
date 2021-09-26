import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import InvoiceModal from "./components/InvoiceModal";
import DetailInvoice from "./components/DetailInvoice";
import  NotFound  from "./components/NotFound";
import Modal from "./components/Modal";
import { useSelector } from "react-redux";

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  const CurrentToggleState = useSelector(
    (state) => state.toggle.toggleModalState
  );
  const CurrentToggleConfirmState = useSelector(
    (state) => state.toggleConfirm.toggleConfirm
  );
  // Check for ViewPort of user & restrict if user is on small viewport
  useEffect(() => {
    window.addEventListener("resize", updateWindowWidth);

    if (windowWidth <= 750) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  });

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  return (
    <div>
      {!isMobile ? (
        
        <div className="app flex flex-column">
          <Navigation />
          <Router>
          <div className="app-content flex flex-column">
            
           { CurrentToggleConfirmState && <Modal/> }
            {CurrentToggleState && <InvoiceModal /> }
            <Switch>
          <Route exact path="/">
          <Home />
          </Route>
          <Route path="/invoice/:invoiceId">
          <DetailInvoice/>
          </Route>
          <Route path="*">
          <NotFound/>
          </Route>
        </Switch>
            
          </div>
          </Router>
        </div>
        
      ) : (
        <div className="mobile-message flex flex-column">
          <h2>Sorry, this app is not supported on Mobile Devices</h2>
          <p>To use this app, please use a computer or Tablet</p>
        </div>
      )}
    </div>
  );
}

export default App;
