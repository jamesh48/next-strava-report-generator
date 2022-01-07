import React from "react";
import CombinedReducers from "./globalReducers.js";
const GlobalStoreContext = React.createContext();

const initialState = {
  totalEntries: [],
  isLoaded: null,
  sortCondition: "speedDesc"
};

const GlobalStoreProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(CombinedReducers, initialState);
  const store = React.useMemo(() => [state, dispatch], [state]);
  return (
    <GlobalStoreContext.Provider value={store}>{children}</GlobalStoreContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = React.useContext(GlobalStoreContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export { useGlobalContext, GlobalStoreProvider };
