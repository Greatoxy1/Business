// api.js
import axios from "axios";

export const getListings = () =>
  axios.get("http://localhost:5000/listings");

export const addListing = (data) =>
  axios.post("http://localhost:5000/add-listing", data);