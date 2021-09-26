import React from 'react';
import "./Invoices.css";
import { Link } from 'react-router-dom';

const Invoices = ({invoice}) => {
 
    return (
        <Link to = {{
          pathname:`/invoice/${invoice.docId}`,
          
        }}  className="invoice flex">
            <div className="left flex">
      <span className="tracking-number">#{ invoice.invoiceId.slice(0,6) }</span>
      <span className="due-date">{ invoice.paymentDueDate }</span>
      <span className="person">{ invoice.clientName }</span>
    </div>
    <div className="right flex">
      <span className="price">${ invoice.invoiceTotal }</span>
      <div
        className={`status-button flex ${invoice.invoicePaid ? "paid" : "" } ${invoice.invoiceDraft ? "draft" : "" } ${invoice.invoicePending ? "pending" : "" }`}
       
      >
      { invoice.invoicePaid && <span >Paid</span> }
       { invoice.invoiceDraft && <span >Draft</span>}
       { invoice.invoicePending && <span >Pending</span>}
      </div>
      <div className="icon">
        <img src="@/assets/icon-arrow-right.svg" alt="" />
      </div>
    </div>
        </Link>
    )
}

export default Invoices
