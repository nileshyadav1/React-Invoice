import React, { useState, useEffect } from "react";
import "./Home.css";
import Invoices from "./Invoices";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import { ToggleModalAction } from "../state/ToggleModalSlice";
import {
  getAllInvoices,
  getAllInvoicesFromState,
  inVoiceIsLoading,
} from "../state/GetInvoiceSlice";

const Home = () => {
  const [filterMenu, setfilerMenu] = useState(false);
  const [filteredInvoice, setfilteredInvoice] = useState(null);
  const [AllInvoices, setAllInvoices] = useState();

  const invoices = useSelector(getAllInvoicesFromState);
 
  const InvoiceIsLoading = useSelector(inVoiceIsLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllInvoices());
    
  }, [dispatch]);

  const handleDispatch = () => {
    dispatch(ToggleModalAction());
  };

  const filteredInvoices = (e) => {
    if (e.target.innerText === "Clear Filter") {
      setfilteredInvoice(null);
      return;
    }
    setfilteredInvoice(e.target.innerText);
  };

  useEffect(() => {
    setAllInvoices(invoices);

    const filteredData = invoices.filter((invoice) => {
      if (filteredInvoice === "Draft") {
        return invoice.invoiceDraft === true;
      }

      if (filteredInvoice === "Pending") {
        return invoice.invoicePending === true;
      }
      if (filteredInvoice === "Paid") {
        return invoice.invoicePaid === true;
      }

      return invoice
    });


    setAllInvoices(filteredData);
   


  }, [invoices, filteredInvoice]);


  return (
    <div className="home container">
      <div className="heading flex">
        <div className="left flex flex-column">
          <h1>Invoices</h1>
          <span>There are {invoices.length} total invoices</span>
        </div>

        <div className="right flex">
          <div
            className="filter flex"
            onClick={() => setfilerMenu(!filterMenu)}
          >
            <span>
              Filter by status{" "}
              {filteredInvoice && <strong>: {filteredInvoice}</strong>}
            </span>
            <img src="./assets/icon-arrow-down.svg" alt="" />

            {filterMenu && (
              <ul className="filter-menu">
                <li onClick={filteredInvoices}>Draft</li>
                <li onClick={filteredInvoices}>Pending</li>
                <li onClick={filteredInvoices}>Paid</li>
                <li onClick={filteredInvoices}>Clear Filter</li>
              </ul>
            )}
          </div>

          <div className="button-home flex" onClick={handleDispatch}>
            <div className="inner-button flex">
              <img src="./assets/icon-plus.svg" alt="" />
            </div>
            <span>New Invoice</span>
          </div>
        </div>
      </div>

      {/* Invoices */}

      {InvoiceIsLoading ? (
        <Loading />
      ) : (
        <div>
          {invoices.length !== 0 ? (
            <div>
              {AllInvoices?.map((invoice) => (
                <Invoices key={invoice.invoiceId} invoice={invoice} />
              ))}
            </div>
          ) : (
            <div className="empty flex flex-column">
              <img src="./assets/illustration-empty.svg" alt="" />
              <h3>There is nothing here</h3>
              <p>
                Create a new invoice by clicking the New Invoice button and get
                started
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
