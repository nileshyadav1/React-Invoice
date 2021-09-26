import React, { useRef, useState, useEffect } from "react";
import "./InvoiceModal.css";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import { ToggleModalAction } from "../state/ToggleModalSlice";
import { ToggleConfirmModal } from "../state/ToggleConfirmSlice";
import {
  getAllInvoices,
  getCurrentInvoices,
  isEditInvoice,
  
  toggleEditInvoice,
  getCurrentInvoiceDocID,
  getCurrentInvoiceFromState,
} from "../state/GetInvoiceSlice";
import { v4 as uuidv4 } from "uuid";
import db from "../firebase";
import {doc, collection, addDoc , updateDoc} from "firebase/firestore";

const InvoiceModal = () => {
  const dispatch = useDispatch();
  const DocID = useSelector(getCurrentInvoiceDocID);
  const IsEditInvoice = useSelector(isEditInvoice);
  const CurrentInvoice = useSelector(getCurrentInvoiceFromState);

  const handleDispatch = () => {
    if (IsEditInvoice) {
      dispatch(toggleEditInvoice());
      dispatch(ToggleModalAction());
    } else {
      dispatch(ToggleModalAction());
    }
  };

  const invoiceWrap = useRef();
  const checkClick = (e) => {
    if (e.target === invoiceWrap.current) {
      dispatch(ToggleConfirmModal());
    }
  };

  const [isLoading, setIsloading] = useState(false);
  const [billerStreetAddress, setbillerStreetAddress] = useState(
    ""
  );
  const [billerCity, setbillerCity] = useState("");
  const [billerZipCode, setbilleZripCode] = useState();
  const [billerCountry, setbillerCountry] = useState("");
  const [clientName, setclientName] = useState("");
  const [clientEmail, setclientEmail] = useState("");
  const [clientStreetAddress, setclientStreetAddress] = useState("");
  const [clientCity, setclientCity] = useState("");
  const [clientZipCode, setclientZipCode] = useState("");
  const [clientCountry, setclientCountry] = useState("");
  const [invoiceDateUnix, setinvoiceDateUnix] = useState(null);
  const [invoiceDate, setinvoiceDate] = useState("");
  const [paymentTerms, setpaymentTerms] = useState(30);
  const [paymentDueDateUnix, setpaymentDueDateUnix] = useState(null);
  const [paymentDueDate, setpaymentDueDate] = useState("");
  const [productDescription, setproductDescription] = useState("");
 
  const invoicePending = useRef(false);
  const invoiceDraft = useRef(false);

  const [invoiceItemList, setinvoiceItemList] = useState([]);

  const invoiceTotal = useRef(0);

  // Get Current Date field
  useEffect(() => {
    if (!IsEditInvoice) {
      const date = Date.now();

      const LocaleDate = new Date(date).toLocaleDateString(
        "en-us",
        dateOptions
      );
      setinvoiceDateUnix(date);
      setinvoiceDate(LocaleDate);
    }

    if (IsEditInvoice) {
      setbillerStreetAddress(CurrentInvoice.billerStreetAddress);
      setbillerCity(CurrentInvoice.billerCity);
      setbilleZripCode(CurrentInvoice.billerZipCode);
      setbillerCountry(CurrentInvoice.billerCountry);
      setclientName(CurrentInvoice.clientName);
      setclientEmail(CurrentInvoice.clientEmail);
      setclientStreetAddress(CurrentInvoice.clientStreetAddress);
      setclientCity(CurrentInvoice.clientCity);
      setclientZipCode(CurrentInvoice.clientZipCode);
      setclientCountry(CurrentInvoice.clientCountry);

      setinvoiceDate(CurrentInvoice.invoiceDate);
      setpaymentDueDateUnix(CurrentInvoice.paymentDueDateUnix);
      setpaymentDueDate(CurrentInvoice.paymentDueDate);
      setpaymentTerms(CurrentInvoice.paymentTerms);
      setinvoiceDateUnix(CurrentInvoice.invoiceDateUnix);

      invoiceDraft.current = CurrentInvoice.invoiceDraft;
      invoiceTotal.current = CurrentInvoice.invoiceTotal;
     
      invoicePending.current = CurrentInvoice.invoicePending;
      

      setproductDescription(CurrentInvoice.productDescription);

      setinvoiceItemList(CurrentInvoice.invoiceItemList);
    }
  }, []);

  // UseState Variables
  const [dateOptions] = useState({
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
   
      const futureDate = new Date();
      const unixDate = futureDate.setDate(
        futureDate.getDate() + parseInt(paymentTerms)
      );

      setpaymentDueDateUnix(unixDate);

      const x = new Date(unixDate).toLocaleDateString("en-us", dateOptions);
      setpaymentDueDate(x);
   
  }, [paymentTerms]);

  // clear Input Fields after upload
  const clearInput = () => {
    setbillerStreetAddress("");
    setbillerCity("");
    setbilleZripCode("");
    setbillerCountry("");
    setclientName("");
    setclientEmail("");
    setclientStreetAddress("");
    setclientCity("");
    setclientZipCode("");
    setclientCountry("");
    setinvoiceDateUnix(null);
    setinvoiceDate("");
    setpaymentDueDateUnix(null);
    setpaymentDueDate("");
    setpaymentTerms(30);

    setpaymentDueDate("");
    invoiceDraft.current = false;
    invoiceTotal.current = 0;
   
    invoicePending.current = false;
   

    setproductDescription("");

    setinvoiceItemList([]);
  };

  const handleDraft = () => {
   
    invoiceDraft.current = true;
    handleSubmit();
    
  };
  const handlePublish = () => {
    
    invoicePending.current = true;

    handleSubmit();
  };


  

  const calInvoiceTotal = () => {
    //
    let x = 0;
    invoiceItemList.forEach((item) => {
     
      x += item.price * item.qty;
    });

    invoiceTotal.current = x;
    
  };

  // Upload Invoice to firebase
  const handleSubmit = async () => {
    
    setIsloading(true);

    if (invoiceItemList.itemName === "") {
      alert("Please ensure you filled out work items!");
      return;
    }

    calInvoiceTotal();

   

    return new Promise((resolve, reject) => {
      addDoc(collection(db, "invoices"), {
        invoiceID: uuidv4(),
        billerStreetAddress: billerStreetAddress,
        billerCity: billerCity,
        billerZipCode: billerZipCode,
        billerCountry: billerCountry,
        clientName: clientName,
        clientEmail: clientEmail,
        clientStreetAddress: clientStreetAddress,
        clientCity: clientCity,
        clientZipCode: clientZipCode,
        clientCountry: clientCountry,
        invoiceDate: invoiceDate,
        paymentTerms: paymentTerms,
        paymentDueDate: paymentDueDate,
        productDescription: productDescription,
        invoiceItemList: invoiceItemList,
        invoicePaid: null,
        invoiceTotal: invoiceTotal.current,
        invoicePending: invoicePending.current,
        invoiceDraft: invoiceDraft.current,
        invoiceDateUnix: invoiceDateUnix,
        paymentDueDateUnix: paymentDueDateUnix,
      })
        .then((response) => {
          console.log("REsponse", response);
          setIsloading(false);
          clearInput();
          dispatch(ToggleModalAction());
          dispatch(getAllInvoices());
          resolve(response);
        })
        .catch((error) => {
          console.log(" Error", error);
          reject(error);
        });
    });
  };


  // Update Edit Invoice to firebase
  const handleUpdate = async () => {
   
    setIsloading(true);

    if (invoiceItemList.itemName === "") {
      alert("Please ensure you filled out work items!");
      return;
    }

    calInvoiceTotal();

   

    return new Promise((resolve, reject) => {
      updateDoc(doc(db, "invoices",DocID), {
       
        billerStreetAddress: billerStreetAddress,
        billerCity: billerCity,
        billerZipCode: billerZipCode,
        billerCountry: billerCountry,
        clientName: clientName,
        clientEmail: clientEmail,
        clientStreetAddress: clientStreetAddress,
        clientCity: clientCity,
        clientZipCode: clientZipCode,
        clientCountry: clientCountry,
       
        paymentTerms: paymentTerms,
        paymentDueDate: paymentDueDate,
        productDescription: productDescription,
        invoiceItemList: invoiceItemList,
       
        invoiceTotal: invoiceTotal.current,
       
       
        paymentDueDateUnix: paymentDueDateUnix,
      })
        .then((response) => {
          console.log("REsponse", response);
          setIsloading(false);
          clearInput();
          dispatch(toggleEditInvoice());
          dispatch(ToggleModalAction());
          dispatch(getCurrentInvoices(DocID));
          resolve(response);
        })
        .catch((error) => {
          console.log(" Error", error);
          reject(error);
        });
    });
  };

  const addNewInvoiceItem = () => {
    const obj = {
      id: uuidv4(),
      itemName: "",
      qty: 0,
      price: 0,
      total: 0,
    };

    setinvoiceItemList([...invoiceItemList, obj]);

    console.log("New added element", invoiceItemList);
  };

  const updateFieldChange = (index) => (e) => {
    console.log("index: " + index);
    let newArr = [...invoiceItemList];
    newArr[index].itemName = e.target.value;
    setinvoiceItemList(newArr);
  };

  const deleteInvoiceItem = (id) => {
    const newArray = invoiceItemList.filter((item) => item.id !== id);
    setinvoiceItemList(newArray);
  };

  return (
    <div
      className="invoice-wrap flex flex-column"
      ref={invoiceWrap}
      onClick={checkClick}
    >
      <form className="invoice-content">
        {isLoading && <Loading />}
        <div className="invoice-header flex">
          {!IsEditInvoice ? <h1>New Invoice</h1> : <h1>Edit Invoice</h1>}
          <button onClick={handleDispatch}>
            <span>close</span>
          </button>
        </div>

        {/* Bill From */}
        <div className="bill-from flex flex-column">
          <h4>Bill From</h4>

          {/* Biller Street Address */}
          <div className="input flex flex-column">
            <label>Street Address</label>
            <input
              type="text"
              required
              id="billerStreetAddress"
              onChange={(e) => {
                setbillerStreetAddress(e.target.value);
              }}
              value={billerStreetAddress}
            />
          </div>

          {/* Biller Location */}

          <div className="location-details flex">
            <div className="input flex flex-column">
              <label>City</label>
              <input
                type="text"
                required
                id="billerCity"
                onChange={(e) => {
                  setbillerCity(e.target.value);
                }}
                value={billerCity}
              />
            </div>
            <div className="input flex flex-column">
              <label>Zip Code</label>
              <input
                type="text"
                required
                id="billerZipCode"
                onChange={(e) => {
                  setbilleZripCode(e.target.value);
                }}
                value={billerZipCode}
              />
            </div>
            <div className="input flex flex-column">
              <label>Country</label>
              <input
                type="text"
                required
                id="billerCountry"
                onChange={(e) => {
                  setbillerCountry(e.target.value);
                }}
                value={billerCountry}
              />
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="bill-to flex flex-column">
          <h4>Bill To</h4>

          <div className="input flex flex-column">
            <label>Client's Name</label>
            <input
              required
              type="text"
              id="clientName"
              onChange={(e) => {
                setclientName(e.target.value);
              }}
              value={clientName}
            />
          </div>
          <div className="input flex flex-column">
            <label>Client's Email</label>
            <input
              required
              type="text"
              id="clientEmail"
              onChange={(e) => {
                setclientEmail(e.target.value);
              }}
              value={clientEmail}
            />
          </div>
          <div className="input flex flex-column">
            <label>Street Address</label>
            <input
              required
              type="text"
              id="clientStreetAddress"
              onChange={(e) => {
                setclientStreetAddress(e.target.value);
              }}
              value={clientStreetAddress}
            />
          </div>
          <div className="location-details flex">
            <div className="input flex flex-column">
              <label>City</label>
              <input
                required
                type="text"
                id="clientCity"
                onChange={(e) => {
                  setclientCity(e.target.value);
                }}
                value={clientCity}
              />
            </div>
            <div className="input flex flex-column">
              <label>Zip Code</label>
              <input
                required
                type="text"
                id="clientZipCode"
                onChange={(e) => {
                  setclientZipCode(e.target.value);
                }}
                value={clientZipCode}
              />
            </div>
            <div className="input flex flex-column">
              <label>Country</label>
              <input
                required
                type="text"
                id="clientCountry"
                onChange={(e) => {
                  setclientCountry(e.target.value);
                }}
                value={clientCountry}
              />
            </div>
          </div>
        </div>

        {/* Invoice Work Details  */}
        <div className="invoice-work flex flex-column">
          <div className="payment flex">
            <div className="input flex flex-column">
              <label>Invoice Date</label>
              <input
                disabled
                type="text"
                id="invoiceDate"
                value={invoiceDate}
              />
            </div>
            <div className="input flex flex-column">
              <label>Payment Due</label>
              <input
                disabled
                type="text"
                id="paymentDueDate"
                value={paymentDueDate}
              />
            </div>
          </div>
          <div className="input flex flex-column">
            <label>Payment Terms</label>
            <select
              required
              type="text"
              id="paymentTerms"
              onChange={(e) => setpaymentTerms(e.target.value)}
            >
              <option value="30">Net 30 Days</option>
              <option value="60">Net 60 Days</option>
            </select>
          </div>
          <div className="input flex flex-column">
            <label>Product Description</label>
            <input
              required
              type="text"
              id="productDescription"
              value={productDescription}
              onChange={(e) => setproductDescription(e.target.value)}
            />
          </div>
          <div className="work-items">
            <h3>Item List</h3>
            <table className="item-list">
              <thead>
                <tr className="table-heading flex">
                  <th className="item-name">Item Name</th>
                  <th className="qty">Qty</th>
                  <th className="price">Price</th>
                  <th className="totalAmount">Total</th>
                </tr>
              </thead>
              <tbody>
               

                {invoiceItemList.map((item, index) => (
                  <tr className="table-items flex" key={item.id}>
                    <td className="item-name">
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => {
                          let newArr = [...invoiceItemList];
                       
                          let newItem = { ...newArr[index] };
                          newItem.itemName = e.target.value;
                          newArr[index] = newItem;
                          setinvoiceItemList(newArr);
                        }}
                      />
                    </td>
                    <td className="qty">
                      <input
                        type="text"
                        value={item.qty}
                        onChange={(e) => {
                          let newArr = [...invoiceItemList];
                         

                          let newItem = { ...newArr[index] };
                          newItem.qty = e.target.value;
                          newItem.total = newItem.price * newItem.qty;
                          newArr[index] = newItem;
                         
                          setinvoiceItemList(newArr);
                        }}
                      />
                    </td>
                    <td className="price">
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => {
                          let newArr = [...invoiceItemList];
                          
                          let newItem = { ...newArr[index] };
                          newItem.price = e.target.value;
                          newItem.total = newItem.price * newItem.qty;
                          newArr[index] = newItem;
                          setinvoiceItemList(newArr);
                        }}
                      />
                    </td>
                    <td className="totalAmount flex">
                      {!isEditInvoice && (item.price * item.qty)}
                      {isEditInvoice && (item.price * item.qty)}
                    </td>
                    {/* <td className="totalAmount flex">
                     {  (item.total = item.price * item.qty)}
                      
                     
                    </td> */}
                    <td>
                      <img
                        onClick={() => {
                          deleteInvoiceItem(item.id);
                        }}
                        src="./assets/icon-delete.svg"
                        alt="Delete"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex button" onClick={addNewInvoiceItem}>
              <img src="./assets/icon-plus.svg" alt="" />
              Add New Item
            </div>
          </div>
        </div>

        {/* Save/Exit  */}
        <div className="save flex">
          <div className="left">
            <button type="button" className="red" onClick={handleDispatch}>
              Cancel
            </button>
          </div>
          <div className="right flex">
            {!IsEditInvoice && (
              <button
                type="button"
                className="dark-purple"
                onClick={handleDraft}
              >
                Save Draft
              </button>
            )}
            {!IsEditInvoice && (
              <button type="button" className="purple" onClick={handlePublish}>
                Create Invoice
              </button>
            )}
            {IsEditInvoice && (
              <button type="button" className="purple" onClick={handleUpdate}>
                Update Invoice
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceModal;
