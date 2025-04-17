import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "screens/landing_page";
import {
Signup, Login,
PetsSinglePageTable
} from "screens";
import Session from "shared/session";

function PrivateRoute({ children }) {
    const loggedin = Session.Retrieve("isAuthenticated", true);
    return loggedin ? children : <Navigate to="/login" />;
}

const Component = (props) => {

    const loggedin = Session.Retrieve("isAuthenticated", true);

    return (
        <Routes>
            

                                                <Route path="/" element={<LandingPage {...props} title={'LandingPage'} nolistbar={true} />} />
            <Route exact path="/signup" element={<Signup />} />
            { !loggedin && <Route exact path="/login" element={<Login />} /> }
            
                <Route path="/product_singlePageTable1" element={<PetsSinglePageTable {...props} title={'Single Page Table Layout'} />} />
                                                                                                        </Routes>
    )

};

export default Component;
