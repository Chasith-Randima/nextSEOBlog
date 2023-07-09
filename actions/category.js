import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleResponse } from "./auth";

export const create = async (category, token) => {
  let url = `${API}/category`;
  //   return await fetch(`${API}/signup`, {
  return fetch(url, {
    method: "POST",
    // headers: {
    //   Accept: "application/json",
    //   "Content-Type": "application/json",
    // },
    headers: {
      // Check what headers the API needs. A couple of usuals right below
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getCategories = async () => {
  let url = `${API}/categories`;

  return fetch(url, {
    method: "GET",
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const signleCategory = async (slug) => {
  let url = `${API}/category/${slug}`;
  return fetch(url, {
    method: "GET",
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const removeCategory = async (slug, token) => {
  let url = `${API}/category/${slug}`;
  //   return await fetch(`${API}/signup`, {
  return fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};
