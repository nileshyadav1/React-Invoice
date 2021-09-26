import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import db from "../firebase";
import { collection, getDocs ,getDoc , doc} from "firebase/firestore";

export const getAllInvoices = createAsyncThunk(
  'invoice/getAllInvoices',
  async () => {
    const querySnapshot = await getDocs(collection(db, "invoices"));
    const getallData=[];

    // Get All value and store them in getallData[]
    querySnapshot.forEach((doc) => {
  
      const data = {
      docId: doc.id,
      invoiceId: doc.data().invoiceID,
      billerStreetAddress: doc.data().billerStreetAddress,
      billerCity: doc.data().billerCity,
      billerZipCode: doc.data().billerZipCode,
      billerCountry: doc.data().billerCountry,
      clientName: doc.data().clientName,
      clientEmail: doc.data().clientEmail,
      clientStreetAddress: doc.data().clientStreetAddress,
      clientCity: doc.data().clientCity,
      clientZipCode: doc.data().clientZipCode,
      clientCountry: doc.data().clientCountry,
      // invoiceDateUnix: doc.data().invoiceDateUnix,
      invoiceDate: doc.data().invoiceDate,
      paymentTerms: doc.data().paymentTerms,
      // paymentDueDateUnix: doc.data().paymentDueDateUnix,
      paymentDueDate: doc.data().paymentDueDate,
      productDescription: doc.data().productDescription,
      invoiceItemList: doc.data().invoiceItemList,
      invoiceTotal: doc.data().invoiceTotal,
      invoicePending: doc.data().invoicePending,
      invoiceDraft: doc.data().invoiceDraft,
      invoicePaid: doc.data().invoicePaid,
      };
      
    
      getallData.push(data);
  
   
      });

      console.log("Alldata",getallData);
      return getallData
    
  }
)
export const getCurrentInvoices = createAsyncThunk(
  'invoice/getCurrentInvoice',
  async (invoiceId) => {

   
    const query = doc(db , "invoices",invoiceId);
    const data = await getDoc(query)
      return data
    
  }
)

const initialState = {
  allInvoice: [],
  invoiceLoaded : false,
  
  currentInvoice: {},
  editInvoice :false,
  currentInvoiceDocId:null,
  
};

const GetInvoiceSlice = createSlice({
  name: "getinvoice",
  initialState,
  reducers: {
    
    toggleEditInvoice : (state )=>{
      state.editInvoice = !state.editInvoice;
    },
    SetCurrentInvoiceDocID : (state , action )=>{
      state.currentInvoiceDocId = action.payload;
    }

  },
  extraReducers: {
    [getAllInvoices.pending]: (state, ) => {
     
      state.invoiceLoaded = true;
     
     
    },
    
    [getAllInvoices.fulfilled]: (state, { payload }) => {
      state.invoiceLoaded = false;
      state.allInvoice = payload;
     
     
     
     
    },
    [getCurrentInvoices.pending]: (state, ) => {
     
      state.invoiceLoaded = true;
      
     
    },
    
    [getCurrentInvoices.fulfilled]: (state, { payload }) => {
      state.invoiceLoaded = false;
      
     state.currentInvoice =payload.data()
     
    
     
    },
   
  },


});

export const {  toggleEditInvoice  ,SetCurrentInvoiceDocID} = GetInvoiceSlice.actions;
export const getAllInvoicesFromState = (state) => state.getinvoice.allInvoice;
export const inVoiceIsLoading = (state) => state.getinvoice.invoiceLoaded;
export const isEditInvoice = (state) => state.getinvoice.editInvoice;
export const getCurrentInvoiceFromState = (state) => state.getinvoice.currentInvoice;
export const getCurrentInvoiceArrayFromState = (state) => state.getinvoice.currentInvoiceArray;
export const getCurrentInvoiceDocID = (state) => state.getinvoice.currentInvoiceDocId;


export default GetInvoiceSlice.reducer;
