import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/layout.js'
import SEO from '../components/seo.js'
import { graphql } from 'gatsby'

import DocDisplay from '../components/docDisplay.js'
import './_docPage.scss'

const DocPage = ({ data, pageContext }) => {
  return (
    <Layout>
      <SEO
        title={data.docs.object.title}
        keywords={[`${data.docs.object.title}`, 'gatsby', 'documentation']}
      />
      <DocDisplay
        doc={data.docs.object}
        writeKey={pageContext.writeKey}
        cosmicBucket={pageContext.cosmicBucket}
      />
    </Layout>
  )
}

export const query = graphql`
  query($cosmicBucket: String!, $title: String!, $readKey: String!) {
    docs {
      object(bucket_slug: $cosmicBucket, slug: $title, read_key: $readKey) {
        title
        content
        created_at
        _id
        metafields {
          key
          value
        }
      }
    }
  }
`

DocPage.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object,
}

export default DocPage
