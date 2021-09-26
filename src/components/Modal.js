import React from 'react';
import "./Modal.css";
import db from "../firebase";
import {  doc ,deleteDoc} from "firebase/firestore";
import { useHistory } from 'react-router-dom';
import { useDispatch , useSelector} from "react-redux";
import { ToggleModalAction } from "../state/ToggleModalSlice";
import { ToggleConfirmModal } from "../state/ToggleConfirmSlice";
import { getCurrentInvoiceDocID } from "../state/GetInvoiceSlice";

const Modal = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const DocID = useSelector(getCurrentInvoiceDocID);

    const Return =()=>{
        dispatch(ToggleConfirmModal());
    }   

    const cancelDelete =()=>{
      dispatch(ToggleConfirmModal());
    }
    const DeleteInvoice =()=>{
      

      const query = doc(db , "invoices",DocID);
 

    return new Promise((resolve, reject) => {
      deleteDoc(query)
        .then((response) => {
          console.log("REsponse", response);
          dispatch(ToggleConfirmModal());
          history.push("/");
          resolve(response);
        })
        .catch((error) => {
          console.log(" Error", error);
          reject(error);
        });
    });
    }

    const Close =()=>{
        dispatch(ToggleModalAction());
        dispatch(ToggleConfirmModal());
    }

    return (

      <div>

      { DocID ? ( <div className="modal flex">
        <div className="modal-content">
          <p>Are you sure you want to delete the invoice</p>
          <div className="actions flex">
            <button onClick={cancelDelete} className="purple">Cancel</button>
            <button  onClick={DeleteInvoice} className="red">Delete</button>
          </div>
        </div>
      </div>) : (<div className="modal flex">
        <div className="modal-content">
          <p>Are you sure you want to exit? Your changes will not be saved?</p>
          <div className="actions flex">
            <button onClick={Return} className="purple">Return</button>
            <button  onClick={Close} className="red">Close</button>
          </div>
        </div>
      </div>)
      }
      </div>
    )
}

export default Modal
