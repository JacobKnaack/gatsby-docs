require("dotenv").config();
const path = require('path');
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  const pageContext = {
    writeKey: `${process.env.COSMIC_WRITE_KEY}`,
    readKey: `${process.env.COSMIC_READ_KEY}`,
    cosmicBucket: `${process.env.COSMIC_BUCKET}`,
  }
  if (process.env.NODE_ENV === 'production') {
    pageContext.buildhookUrl = `${process.env.BUILDHOOK_ENDPOINT}`
  }
  deletePage(page)
  createPage({
    ...page,
    context: pageContext,
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  createRedirect({
    fromPath: `/doc/*`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/`,
  })

  return new Promise((resolve, reject) => {
    const docTemplate = path.resolve(`src/templates/docPage.js`)

    resolve(
      graphql(`
        query {
          docs {
            objectsByType(bucket_slug: "${process.env.COSMIC_BUCKET}", type_slug: "docs", read_key: "${process.env.COSMIC_READ_KEY}") {
              title
            }
          }
        }
      `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        if (result.data.docs.objectsByType.length) {
          result.data.docs.objectsByType.forEach(doc => {
            let slug = doc.title.toLowerCase().replace(/[^a-zA-Z ]/g, "").replace(/\s/g, '-')
            createPage({
              path: `/doc/${slug}`,
              component: docTemplate,
              context: {
                cosmicBucket: `${process.env.COSMIC_BUCKET}`,
                readKey: `${process.env.COSMIC_READ_KEY}`,
                writeKey: `${process.env.COSMIC_WRITE_KEY}`,
                title: slug,
              }
            })
          })
        }
      })
    )
  })
}