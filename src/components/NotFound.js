import React from 'react';
import "./NotFound.css";
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container not-found flex flex-column ">
         <div className="main-section flex flex-column">
          <div className="img-not-found">
          <img src="./assets/page_not_found.svg" alt="" />
          </div>
          <div className="text">
           <h1>Page Not Found</h1>
           <p>Sorry, we could'nt find the page you were looking for.</p>
           <p>We Suggest that you return to main section</p>
           </div>
           </div>

           <div className="return"> 
           <Link to='/' > <button className="button"> Return to main page</button></Link></div>
        </div>
    )
}

export default NotFound
