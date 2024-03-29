import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import { QuillModules, QuillFormats } from "../../helpers/quill";

const CreateBlog = ({ router }) => {
  const blogFromLS = () => {
    if (typeof window === "undefined") {
      return false;
    }

    if (localStorage.getItem("blog")) {
      // return localStorage.getItem("blog");
      console.log(JSON.parse(localStorage.getItem("blog")));
      return JSON.parse(localStorage.getItem("blog"));
    } else {
      return false;
    }
  };

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checked, setChecked] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); // tags

  // const [body, setBody] = useState();
  const [body, setBody] = useState(blogFromLS());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButton: false,
  });

  const { error, sizeError, success, formData, title, hidePublishButton } =
    values;
  const token = getCookie("token");

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [Router]);

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const publishBlog = (e) => {
    e.preventDefault();
    // console.log(formData.body);
    console.log(formData.getAll("body"));
    createBlog(formData, token).then((data) => {
      // console.log(values);
      // console.log(values.formData.keys());
      // for (let val of formData.values()) {
      //   console.log(val);
      // }
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          error: "",
          success: `A new blog titled "${data.title}" is created`,
        });
        setBody("");
        setCategories([]);
        setTags([]);
      }
    });
  };

  const handleChange = (name) => (e) => {
    // console.log(e.target.value);
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.append(name, value);
    setValues({ ...values, [name]: value, formData, error: "" });
  };

  const handleBody = (e) => {
    console.log(e);
    setBody(e);
    console.log(body);
    formData.set("body", e);
    console.log(formData.body);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };

  const handleToggle = (c) => () => {
    setValues({ ...values, error: "" });
    // return the first index or -1
    const clickedCategory = checked.indexOf(c);
    const all = [...checked];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    // console.log(all);
    setChecked(all);
    formData.set("categories", all);
  };

  const handleTagsToggle = (t) => () => {
    setValues({ ...values, error: "" });
    // return the first index or -1
    const clickedTag = checked.indexOf(t);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    // console.log(all);
    setCheckedTag(all);
    formData.set("tags", all);
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggle(c._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleTagsToggle(t._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          />
        </div>

        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing..."
            onChange={handleBody}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {createBlogForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
        </div>

        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured image</h5>
              <hr />

              <small className="text-muted">Max size: 1mb</small>
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />

            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(CreateBlog);

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import Router from "next/router";
// import dynamic from "next/dynamic";
// import { withRouter } from "next/router";
// import { getCookie, isAuth } from "../../actions/auth";
// import { getCategories } from "../../actions/category";
// import { getTags } from "../../actions/tag";
// import { createBlog } from "../../actions/blog";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "../../node_modules/react-quill/dist/quill.snow.css";

// const CreateBlog = ({ router }) => {
//   const blogFromLS = () => {
//     if (typeof window === "undefined") {
//       return false;
//     }

//     if (localStorage.getItem("blog")) {
//       return JSON.parse(localStorage.getItem("blog"));
//     } else {
//       return false;
//     }
//   };

//   const [categories, setCategories] = useState([]);
//   const [tags, setTags] = useState([]);

//   const [checked, setChecked] = useState([]); // categories
//   const [checkedTag, setCheckedTag] = useState([]); // tags

//   const [body, setBody] = useState(blogFromLS());
//   const [values, setValues] = useState({
//     error: "",
//     sizeError: "",
//     success: "",
//     formData: "",
//     title: "",
//     hidePublishButton: false,
//   });

//   const { error, sizeError, success, formData, title, hidePublishButton } =
//     values;
//   const token = getCookie("token");

//   useEffect(() => {
//     setValues({ ...values, formData: new FormData() });
//     initCategories();
//     initTags();
//   }, [router]);

//   const initCategories = () => {
//     getCategories().then((data) => {
//       if (data.error) {
//         setValues({ ...values, error: data.error });
//       } else {
//         setCategories(data);
//       }
//     });
//   };

//   const initTags = () => {
//     getTags().then((data) => {
//       if (data.error) {
//         setValues({ ...values, error: data.error });
//       } else {
//         setTags(data);
//       }
//     });
//   };

//   const publishBlog = (e) => {
//     e.preventDefault();
//     // console.log('ready to publishBlog');
//     console.log(formData.entries(), token);
//     // for (var key of formData.entries()) {
//     //   console.log(key[0] + ", " + key[1]);
//     // }
//     createBlog(formData, token).then((data) => {
//       if (data.error) {
//         setValues({ ...values, error: data.error });
//       } else {
//         setValues({
//           ...values,
//           title: "",
//           error: "",
//           success: `A new blog titled "${data.title}" is created`,
//         });
//         setBody("");
//         setCategories([]);
//         setTags([]);
//       }
//     });
//   };

//   const handleChange = (name) => (e) => {
//     // console.log(e.target.value);
//     const value = name === "photo" ? e.target.files[0] : e.target.value;

//     // if (name === "photo") {
//     //   let value = e.target.files[0];
//     //   formData[name] = value;
//     // } else {
//     //   value = e.target.value;
//     //   formData[name] = value;
//     // }
//     formData.set(name, value);

//     console.log(values);
//     setValues({ ...values, [name]: value, formData, error: "" });
//   };

//   const handleBody = (e) => {
//     console.log(e);
//     setBody(e);
//     // formData.append("body", e);
//     // console.log(formData);
//     console.log(body);
//     // formData.body = e;
//     values.formData = e;
//     console.log(values);
//     if (typeof window !== "undefined") {
//       localStorage.setItem("blog", JSON.stringify(e));
//     }
//   };

//   const handleToggle = (c) => () => {
//     setValues({ ...values, error: "" });
//     // return the first index or -1
//     const clickedCategory = checked.indexOf(c);
//     const all = [...checked];

//     if (clickedCategory === -1) {
//       all.push(c);
//     } else {
//       all.splice(clickedCategory, 1);
//     }
//     console.log(all);
//     setChecked(all);
//     formData.append("categories", all);
//     console.log(values);
//   };

//   const handleTagsToggle = (t) => () => {
//     setValues({ ...values, error: "" });
//     // return the first index or -1
//     const clickedTag = checked.indexOf(t);
//     const all = [...checkedTag];

//     if (clickedTag === -1) {
//       all.push(t);
//     } else {
//       all.splice(clickedTag, 1);
//     }
//     console.log(all);
//     setCheckedTag(all);
//     formData.set("tags", all);
//     console.log(values);
//   };

//   const showCategories = () => {
//     return (
//       categories &&
//       categories.map((c, i) => (
//         <li key={i} className="list-unstyled">
//           <input
//             onChange={handleToggle(c._id)}
//             type="checkbox"
//             className="mr-2"
//           />
//           <label className="form-check-label">{c.name}</label>
//         </li>
//       ))
//     );
//   };

//   const showTags = () => {
//     return (
//       tags &&
//       tags.map((t, i) => (
//         <li key={i} className="list-unstyled">
//           <input
//             onChange={handleTagsToggle(t._id)}
//             type="checkbox"
//             className="mr-2"
//           />
//           <label className="form-check-label">{t.name}</label>
//         </li>
//       ))
//     );
//   };

//   const createBlogForm = () => {
//     return (
//       <form onSubmit={publishBlog}>
//         <div className="form-group">
//           <label className="text-muted">Title</label>
//           <input
//             type="text"
//             className="form-control"
//             value={title}
//             onChange={handleChange("title")}
//           />
//         </div>

//         <div className="form-group">
//           <ReactQuill
//             modules={CreateBlog.modules}
//             formats={CreateBlog.formats}
//             value={body}
//             placeholder="Write something amazing..."
//             onChange={handleBody}
//           />
//         </div>

//         <div>
//           <button type="submit" className="btn btn-primary">
//             Publish
//           </button>
//         </div>
//       </form>
//     );
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-8">
//           {createBlogForm()}
//           <hr />
//           {JSON.stringify(title)}
//           <hr />
//           {JSON.stringify(body)}
//           <hr />
//           {JSON.stringify(categories)}
//           <hr />
//           {JSON.stringify(tags)}
//         </div>

//         <div className="col-md-4">
//           <div>
//             <div className="form-group pb-2">
//               <h5>Featured image</h5>
//               <hr />

//               <small className="text-muted">Max size: 1mb</small>
//               <label className="btn btn-outline-info">
//                 Upload featured image
//                 <input
//                   onChange={handleChange("photo")}
//                   type="file"
//                   accept="image/*"
//                   hidden
//                 />
//               </label>
//             </div>
//           </div>
//           <div>
//             <h5>Categories</h5>
//             <hr />

//             <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
//               {showCategories()}
//             </ul>
//           </div>
//           <div>
//             <h5>Tags</h5>
//             <hr />
//             <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
//               {showTags()}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// CreateBlog.modules = {
//   toolbar: [
//     [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { font: [] }],
//     [{ size: [] }],
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [{ list: "ordered" }, { list: "bullet" }],
//     ["link", "image", "video"],
//     ["clean"],
//     ["code-block"],
//   ],
// };

// CreateBlog.formats = [
//   "header",
//   "font",
//   "size",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
//   "link",
//   "image",
//   "video",
//   "code-block",
// ];

// export default withRouter(CreateBlog);

// import Link from "next/link";
// import React, { useState, useEffect } from "react";
// import Router from "next/router";
// import dynamic from "next/dynamic";
// import { withRouter } from "next/router";
// import { getCookie, isAuth } from "../../actions/auth";
// import { getCategories } from "../../actions/category";
// import { getTags } from "../../actions/tag";
// import { createBlog } from "../../actions/blog";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "../../node_modules/react-quill/dist/quill.snow.css";

// const CreateBlog = ({ router }) => {
//   const blogFromLS = () => {
//     if (typeof window === "undefined") {
//       return false;
//     }

//     if (localStorage.getItem("blog")) {
//       return JSON.parse(localStorage.getItem("blog"));
//     } else {
//       return false;
//     }
//   };

//   const [categories, setCategories] = useState([]);
//   const [tags, setTags] = useState([]);

//   const [checked, setChecked] = useState([]);
//   const [checkedTag, setCheckedTag] = useState([]);

//   const [body, setBody] = useState(blogFromLS());
//   const [values, setValues] = useState({
//     error: "",
//     sizeError: "",
//     success: "",
//     formData: "",
//     title: "",
//     hidePublishButton: false,
//   });

//   const { error, sizeError, success, formData, title, hidePublishButton } =
//     values;

//   const token = getCookie("token");

//   useEffect(() => {
//     setValues({ ...values, formData: new FormData() });
//     initCategories();
//     initTags();
//   }, [router]);

//   const initCategories = () => {
//     getCategories().then((data) => {
//       console.log(data);
//       if (data.error) {
//         setValues({ ...values, error: data.error });
//       } else {
//         setCategories(data);
//       }
//     });
//   };

//   const initTags = () => {
//     getTags().then((data) => {
//       if (data.error) {
//         setValues({ ...values, error: data.error });
//       } else {
//         setTags(data);
//         setCategories([]);
//         setTags([]);
//       }
//     });
//   };

//   const publishBlog = (e) => {
//     e.preventDefault();
//     createBlog(formData, token).then((data) => {
//       console.log(data);
//       if (data.error) {
//         setValues({ ...values, error: data.error });
//       } else {
//         setValues({
//           ...values,
//           title: "",
//           error: "",
//           success: `A new blog titled ${data.title} is created`,
//         });
//         setBody("");
//         setCategories([]);
//         setTags([]);
//       }
//     });
//   };

//   const handleChange = (name) => (e) => {
//     const value = name === "photo" ? e.target.files[0] : e.target.value;
//     formData.set(name, value);
//     setValues({ ...values, [name]: value, formData, error: "" });
//   };
//   const handleBody = (e) => {
//     setBody(e);
//     formData.set("body", e);
//     if (typeof window !== "undefined") {
//       localStorage.setItem("blog", JSON.stringify(e));
//     }
//   };

//   const handleToggle = (c) => () => {
//     setValues({ ...values, error: "" });

//     const clickedCategory = checked.indexOf(c);

//     const all = [...checked];

//     if (clickedCategory === -1) {
//       all.push(c);
//     } else {
//       all.splice(clickedCategory, 1);
//     }

//     console.log(all);
//     setChecked(all);
//     formData.set("categories", all);
//   };
//   const handleTagsToggle = (t) => () => {
//     setValues({ ...values, error: "" });

//     const clickedTags = checkedTag.indexOf(t);

//     const all = [...checkedTag];

//     if (clickedTags === -1) {
//       all.push(t);
//     } else {
//       all.splice(clickedTags, 1);
//     }

//     console.log(all);
//     setCheckedTag(all);
//     formData.set("tags", all);
//   };

//   console.log(categories);
//   const showCategories = () => {
//     return (
//       categories &&
//       categories.map((c, i) => (
//         <li key={i} className="list-unstyled">
//           <input
//             onChange={handleToggle(c._id)}
//             type="checkbox"
//             className="mr-2"
//           />
//           <label className="form-check-label{">{c.name}</label>
//         </li>
//       ))
//     );
//   };
//   const showTags = () => {
//     return (
//       tags &&
//       tags.map((t, i) => (
//         <li key={i} className="list-unstyled">
//           <input
//             onChange={handleTagsToggle(t._id)}
//             type="checkbox"
//             className="mr-2"
//           />
//           <label className="form-check-label{">{t.name}</label>
//         </li>
//       ))
//     );
//   };

//   const createBlogForm = () => {
//     return (
//       <form onSubmit={publishBlog}>
//         <div className="form-group">
//           <label className="text-muted">Title</label>
//           <input
//             value={title}
//             type="text"
//             className="form-control"
//             onChange={handleChange("title")}
//           />
//         </div>
//         <div className="form-group">
//           <ReactQuill
//             modules={CreateBlog.modules}
//             formats={CreateBlog.formats}
//             value={body}
//             placeholder="Write something amazing ..."
//             onChange={handleBody}
//           />
//         </div>
//         <div>
//           <button type="submit" className="btn btn-primary">
//             Publish
//           </button>
//         </div>
//       </form>
//     );
//   };
//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-8">
//           {createBlogForm()}
//           <hr />
//           {JSON.stringify(title)}
//           <hr />
//           {JSON.stringify(body)}
//           <hr />
//           {JSON.stringify(categories)}
//           <hr />
//           {JSON.stringify(tags)}
//         </div>

//         <div className="col-md-4">
//           <div>
//             <div className="form-group pb-2">
//               <h5>Featured Image</h5>
//               <hr />
//               <small className="text-muted">Max size:1mb</small>
//               <label className="btn btn-outline-info">
//                 Upload featured image
//                 <input
//                   onChange={handleChange("photo")}
//                   type="file"
//                   accept="image/*"
//                   hidden
//                 />
//               </label>
//             </div>
//           </div>
//           <div>
//             <h5>Categories</h5>
//             <hr />
//             <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
//               {showCategories()}
//             </ul>
//           </div>
//           <div>
//             <h5>Tags</h5>
//             <hr />
//             <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
//               {showTags()}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// CreateBlog.modules = {
//   toolbar: [
//     [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { font: [] }],
//     [{ size: [] }],
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [{ list: "ordered" }, { list: "bullet" }],
//     ["link", "image", "video"],
//     ["clean"],
//     ["code-block"],
//   ],
// };

// CreateBlog.formats = [
//   "header",
//   "font",
//   "size",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
//   "link",
//   "image",
//   "video",
//   "code-block",
// ];

// export default withRouter(CreateBlog);
