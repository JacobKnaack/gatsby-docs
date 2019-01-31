import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import showdown from 'showdown'
import Cosmic from 'cosmicjs'

const converter = new showdown.Converter({ ghCompatibleHeaderId: true })
const api = Cosmic()

const initialState = {
  content: '',
  table: '',
}

class DocDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = initialState
    this.updateDoc - this.updateDoc.bind(this)
  }

  static getDerivedStateFromProps(props) {
    let toc
    for (const i in props.doc.metafields) {
      if (props.doc.metafields[i].key === 'table_of_contents') {
        toc = props.doc.metafields[i].value
      }
    }

    return {
      content: props.doc.content,
      table: toc
    }
  }

  render() {
    return (
      <div className="doc-container">
        <div className="toc-container">
          <div className="back-bttn">
            <i className="arrow left" />
            <Link to="/">Back To List</Link>
          </div>
          <div
            className="doc-toc"
            dangerouslySetInnerHTML={{ __html: converter.makeHtml(this.state.table) }}
          />
        </div>
        <div
          className="doc-main"
          dangerouslySetInnerHTML={{ __html: converter.makeHtml(this.state.content) }}
        />
        <button className="doc-edit-btn">
          edit
          </button>
      </div>
    )
  }

  updateDoc() {
    const { writeKey, cosmicBucket, /*buildhookUrl*/ } = this.props
    const Bucket = api.bucket({
      slug: cosmicBucket,
      write_key: writeKey
    })

    Bucket.editObject({})
  }
}

DocDisplay.propTypes = {
  writeKey: PropTypes.string,
  cosmicBucket: PropTypes.string,
}

export default DocDisplay