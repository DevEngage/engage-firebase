import React from "react";

const EngageFireContext = React.createContext({hasLoaded: false, isLoggedIn: false, user: null, testList: null});

export default EngageFireContext;
