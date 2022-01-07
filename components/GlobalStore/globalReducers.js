const combineReducers = (slices) => (state, action) =>
  Object.keys(slices).reduce(
    (acc, prop) => ({
      ...acc,
      [prop]: slices[prop](acc[prop], action)
    }),
    state
  );

const totalEntries = (state = [], action) => {
  switch (action.type) {
    case "SET TOTAL ENTRIES":
      return action.payload;
    default:
      return state;
  }
};

const sortCondition = (state = "speedDesc", action) => {
  switch (action.type) {
    case "SET SORT CONDITION":
      return action.payload;
    default:
      return state;
  }
};

const isLoaded = (state = null, action) => {
  switch (action.type) {
    case "TOGGLE LOADED ON":
      return true;
    case "TOGGLE LOADED OFF":
      return false;
    default:
      return state;
  }
};

export default combineReducers({ totalEntries, isLoaded, sortCondition });
