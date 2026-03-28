// api.js
import axios from "axios";

export const getListings = () =>
  axios.get("https://business-3-zwsk.onrender.com/listings");

export const addListing = (data) =>
  axios.post("https://business-3-zwsk.onrender.com/add-listing", data);