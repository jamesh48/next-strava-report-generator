import axios from "axios";
import { authorizeApp } from "./AppUtils";
export const fetchDataUser = () => {
  const userPromise = fetchUser();
  return {
    user: wrapPromise(userPromise)
  };
};

const wrapPromise = (promise: Promise<any>) => {
  // set initial status;
  let status = "pending";
  // Store Result
  let result = "";
  // Wait for promise
  let suspender = promise.then(
    (res) => {
      status = "success";
      result = res;
    },
    (err) => {
      status = "error";
      result = err;
    }
  );
  return {
    // @ts-ignore
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
};

const fetchUser = async () => {
  try {
    const { data } = await axios("/loggedInUser");
    return data;
  } catch (err) {
    // @ts-ignore
    if (err.message.indexOf("429") === -1) {
      authorizeApp();
    } else {
      return 429;
    }
  }
};
