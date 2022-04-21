import fetch from "isomorphic-fetch";
import { API } from "../config";
import queryString from "query-string";
import { handleResponse, isAuth } from "./auth";

export const createBlog = (blog, token) => {
  let createBlogEndPoint;

  if (isAuth() && isAuth().role === 1) {
    createBlogEndPoint = `${API}/blog`;
  } else if (isAuth() && isAuth().role === 0) {
    createBlogEndPoint = `${API}/user/blog`;
  }

  return fetch(`${createBlogEndPoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
  const data = {
    limit,
    skip,
  };
  return fetch(`${API}/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listRelated = (data) => {
  return fetch(`${API}/blogs/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const list = (username) => {
  let listBlogsEndpoint;
  console.log(username);

  if (username) {
    listBlogsEndpoint = `${API}/${username}/blogs`;
    console.log(listBlogsEndpoint);
  } else {
    listBlogsEndpoint = `${API}/blogs`;
  }
  return fetch(`${listBlogsEndpoint}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const removeBlog = (slug, token) => {
  let deleteBlogsEndpoint;

  if (isAuth() && isAuth().role === 1) {
    deleteBlogsEndpoint = `${API}/blogs/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    deleteBlogsEndpoint = `${API}/user/blogs/${slug}`;
  }
  return fetch(`${deleteBlogsEndpoint}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateBlog = (blog, token, slug) => {
  let updateBlogsEndpoint;

  if (isAuth() && isAuth().role === 1) {
    updateBlogsEndpoint = `${API}/blogs/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    updateBlogsEndpoint = `${API}/user/blogs/${slug}`;
  }
  return fetch(`${updateBlogsEndpoint}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listSearch = (params) => {
  console.log("search params front", params);
  let query = queryString.stringify(params);
  console.log("search params  after front", query);
  return fetch(`${API}/blogs/search?${query}`, {
    // return fetch(`${API}/blogs/search?${JSON.stringify(query)}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// export const updateBlog = (blog, token, slug) => {
//   return fetch(`${API}/blogs/${slug}`, {
//     method: "PUT",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(blog),
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .catch((err) => console.log(err));
// };
export const singleBlog = (slug) => {
  return fetch(`${API}/blog/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// import fetch from "isomorphic-fetch";
// import { API } from "../config";

// export const createBlog = async (blog, token) => {
//   console.log(blog);
//   let url = `http://127.0.0.1:8000/api/blog`;
//   //   return await fetch(`${API}/signup`, {
//   return fetch(url, {
//     method: "POST",
//     headers: {
//       // Check what headers the API needs. A couple of usuals right below
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: blog,
//   })
//     .then((response) => {
//       console.log(response);
//       return response.json();
//     })
//     .catch((err) => console.log(err));
// };
