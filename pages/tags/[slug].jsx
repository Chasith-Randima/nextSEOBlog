import Head from "next/head";

import Layout from "../../components/Layout";
import { signleTag } from "../../actions/tag";
import { DOMAIN, APP_NAME, FB_APP_ID } from "../../config";

import Card from "../../components/blog/Card";

const Tag = ({ tag, blogs, query }) => {
  const head = () => (
    <Head>
      <title>
        {tag.name} | {APP_NAME}
      </title>
      <meta
        name="description"
        content={`Best programming tutorials on ${tag.name}`}
      />
      <link rel="canonical" href={`${DOMAIN}/tags/${query.slug}`} />
      <meta property="og:title" content={`${tag.name}| ${APP_NAME}`} />
      <meta
        property="og:description"
        content={`Best programming tutorials on ${tag.name}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/tags/${query.slug}`} />
      <meta
        property="og:image"
        content={`${DOMAIN}/static/images/seoblog.jpg`}
      />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/static/images/seoblog.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="og:fb:app_id" content={`${FB_APP_ID}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
    </Head>
  );
  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">{tag.name}</h1>
                {blogs.map((b, i) => (
                  <div>
                    <Card key={i} blog={b} />
                    <hr />
                  </div>
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </>
  );
};

Tag.getInitialProps = ({ query }) => {
  return signleTag(query.slug).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return { tag: data.tag, blogs: data.blogs, query };
    }
  });
};

export default Tag;
