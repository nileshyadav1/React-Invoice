import React, { useEffect } from "react";
import db from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import "./DetailInvoice.css";
import {
  getCurrentInvoices,
  toggleEditInvoice,
  getCurrentInvoiceFromState,
  inVoiceIsLoading,
  SetCurrentInvoiceDocID
 
} from "../state/GetInvoiceSlice";

import { ToggleConfirmModal } from "../state/ToggleConfirmSlice";

import { ToggleModalAction } from "../state/ToggleModalSlice";
import { Link, useParams } from "react-router-dom";
import Loading from "./Loading";

const DetailInvoice = () => {
  const { invoiceId } = useParams();

  const dispatch = useDispatch();
  const CurrentInvoice = useSelector(getCurrentInvoiceFromState);
  const InvoiceIsLoading = useSelector(inVoiceIsLoading);
  

  

  useEffect(() => {
    dispatch(SetCurrentInvoiceDocID(invoiceId));
    dispatch(getCurrentInvoices(invoiceId));
   
    return () =>{
      dispatch(SetCurrentInvoiceDocID(null));
    }
    
  }, []);

  // Toggle Edit Invoice
  const EditInvoice = ()=>{
    dispatch(toggleEditInvoice());
    dispatch(ToggleModalAction());
  }

  const TriggerDeleteInvoice =()=>{
    dispatch(ToggleConfirmModal());
  }

  const markAsPaid =()=>{
    const query = doc(db , "invoices",invoiceId);
    

    return new Promise((resolve, reject) => {
      updateDoc(query ,{
        invoicePaid : true,
        invoicePending: false
      })
        .then((response) => {
         
          dispatch(getCurrentInvoices(invoiceId));
          resolve(response);
        })
        .catch((error) => {
        
          reject(error);
        });
    });
  }
  const markAsPending =()=>{
    const query = doc(db , "invoices",invoiceId);
   

    return new Promise((resolve, reject) => {
      updateDoc(query ,{
        invoicePaid : false,
        invoicePending: true,
        invoiceDraft :false,
      })
        .then((response) => {
        
          dispatch(getCurrentInvoices(invoiceId));
          resolve(response);
        })
        .catch((error) => {
          console.log(" Error", error);
          reject(error);
        });
    });
  }

  return (
    <div>
      {InvoiceIsLoading ? (
        <Loading />
      ) : (
        <div className="invoice-view container">
          <Link className="nav-link flex" to="/">
            <img src="./assets/icon-arrow-left.svg" alt="" /> Go Back
          </Link>
          <div className="header flex">
            <div className="left flex">
              <span>Status</span>
              <div
                
                className={`status-button flex ${CurrentInvoice.invoicePaid ? "paid" : "" } ${CurrentInvoice.invoiceDraft ? "draft" : "" } ${CurrentInvoice.invoicePending ? "pending" : "" }`}
               
              >
                {CurrentInvoice.invoicePaid  && (
                  <span >Paid</span>
                 )}
                {CurrentInvoice.invoiceDraft && (
                  <span >Draft</span>
                 )}
                 {CurrentInvoice.invoicePending  && (
                  <span >Pending</span>
                 )}
              </div>
            </div>
            <div className="right flex">
              <button className="dark-purple" onClick={EditInvoice}>Edit</button>
              <button className="red" onClick={TriggerDeleteInvoice} >Delete</button>
              {CurrentInvoice.invoicePending  &&  <button  className="green" onClick={markAsPaid}>
                Mark as Paid
              </button> }
           { (CurrentInvoice.invoiceDraft || CurrentInvoice.invoicePaid) &&  <button
              
                className="orange"
                onClick={markAsPending}
              >
                Mark as Pending
              </button> }
            </div>
          </div>
          

          <div className="invoice-details flex flex-column">
            <div className="top flex">
              <div className="left ">
              { CurrentInvoice.invoiceID &&  <p>
                  <span>#</span>
                  {CurrentInvoice.invoiceID.slice(0, 6)}
                </p>
                }
                <p>{CurrentInvoice.productDescription}</p>
              </div>
              <div className="right flex flex-column">
                <p>{CurrentInvoice.billerStreetAddress}</p>
                <p>{CurrentInvoice.billerCity}</p>
                <p>{CurrentInvoice.billerZipCode}</p>
                <p>{CurrentInvoice.billerCountry}</p>
              </div>
            </div>
             <div className="middle flex">
              <div className="payment flex flex-column">
                <h4>Invoice Date</h4>
                <p>{CurrentInvoice.invoiceDate}</p>
                <h4>Payment Date</h4>
                <p>{CurrentInvoice.paymentDueDate}</p>
              </div>
              <div className="bill flex flex-column">
                <h4>Bill To</h4>
                <p>{CurrentInvoice.clientName}</p>
                <p>{CurrentInvoice.clientStreetAddress}</p>
                <p>{CurrentInvoice.clientCity}</p>
                <p>{CurrentInvoice.clientZipCode}</p>
                <p>{CurrentInvoice.clientCountry}</p>
              </div>
              <div className="send-to flex flex-column">
                <h4>Sent To</h4>
                <p>{CurrentInvoice.clientEmail}</p>
              </div>
            </div>
           <div className="bottom flex flex-column">
              <div className="billing-items">
                <div className="heading flex">
                  <p>Item Name</p>
                  <p>QTY</p>
                  <p>Price</p>
                  <p>Total</p>
                </div>
                
                { CurrentInvoice.invoiceItemList?.map((item )=>(
                <div className="item flex" key={item.id}>
                  <p>{item.itemName}</p>
                  <p>{item.qty}</p>
                  <p>{item.price}</p>
                  <p>{item.total}</p>
                  </div>
                ))
                } 
               
              </div>
              <div className="total flex">
                <p>Amount Due</p>
                <p>{CurrentInvoice.invoiceTotal}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailInvoice;
