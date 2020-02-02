import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import firebase from '../firebase.js'

export default class ListPosts extends Component {
  constructor(props){
    super(props)
    this.ref = firebase.firestore().collection('posts')
    this.unsubscribe = null
    this.state = {
      posts: [],
      editorState: EditorState.createEmpty()
    }
  }
  
  onCollectionUpdate = (querySnapshot) => {
    const posts = []
    querySnapshot.forEach((doc) => {
      const {title, content, category, date} = doc.data()
      const postContent = EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
      posts.push({
        key: doc.id,
        doc,
        title,
        content: postContent,
        category,
        date
      })
      console.log(JSON.parse(doc.data().content))
    })
    this.setState({
      posts
    })
  }

  componentDidMount(){
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
  }

  list(){
    return this.state.posts.map((post) => {
      return (
        <tr key={post.key}>
          <td className='pv3 pr3 bb b--black-20'>
            {post.title}
          </td>
          <td className='pv3 pr3 bb b--black-20'>
            {post.category}
          </td>
          <td className='pv3 pr3 bb b--black-20'>
            <div className="readonly-editor">
              <Editor editorState={post.content} readOnly={true} /> 
            </div>
          </td>
          <td className='pv3 pr3 bb b--black-20'>
            {post.date}
          </td>
          <td className='pv3 bb b--black-20'>
            <Link to={`/edit-post/${post.key}`} className="f6 link dim br2 ph3 pv1 mb1 dib white bg-blue">Edit</Link>
          </td>
          <td className='pv3 bb b--black-20'>
            <Link to={'/posts'} onClick={this.delete.bind(this, post.key)} className="f6 link dim br2 ph3 pv1 mb1 dib white bg-red">Delete</Link>
          </td>
        </tr>
      )
    })
  }

  delete(id){
    firebase.firestore().collection('posts').doc(id).delete().then(() => {
      alert('Post successfully deleted!');
      this.props.history.push('/posts')
    }).catch((error) => {
      alert('Error removing post: ', error);
    });
  }

  render(){
    return(
      <div className='pa4 bg-white'>
        <h3 className='fw5'>Posts List</h3>
        <table className='f6 w-100 center'>
          <thead>
            <tr>
              <th className='fw6 bb b--black-20 tl pb3 pr3 bg-white'>Title</th>
              <th className='fw6 bb b--black-20 tl pb3 pr3 bg-white'>Category</th>
              <th className='fw6 bb b--black-20 tl pb3 pr3 bg-white'>Content</th>
              <th className='fw6 bb b--black-20 tl pb3 pr3 bg-white'>Timestamp</th>
              <th className='fw6 bb b--black-20 tl pb3 pr3 bg-white'>Action</th>
              <th className='fw6 bb b--black-20 tl pb3 pr3 bg-white'></th>
            </tr>
          </thead>
          <tbody className='lh-copy'>
            {this.list()}
          </tbody>
        </table>
      </div>
    )
  }
}