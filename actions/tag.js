import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleResponse } from "./auth";

export const create = async (tag, token) => {
  let url = `${API}/tag`;
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
    body: JSON.stringify(tag),
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getTags = async () => {
  let url = `${API}/tags`;
  //   return await fetch(`${API}/signup`, {
  return fetch(url, {
    method: "GET",
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const signleTag = async (slug) => {
  let url = `${API}/tag/${slug}`;
  //   return await fetch(`${API}/signup`, {
  return fetch(url, {
    method: "GET",
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const removeTag = async (slug, token) => {
  let url = `${API}/tag/${slug}`;
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
