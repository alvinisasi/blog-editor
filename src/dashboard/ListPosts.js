import React, { Component, lazy } from 'react'
import firebase from '../firebase.js'

const TablePosts = lazy(() => import('../dashboard/TablePosts.js'))

export default class ListPosts extends Component {
  constructor(props){
    super(props)
    this.ref = firebase.firestore().collection('posts')
    this.unsubscribe = null
    this.state = {
      posts: [],
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    const posts = []
    querySnapshot.forEach((doc) => {
      const {title, content, category, date} = doc.data()
      posts.push({
        key: doc.id,
        doc,
        title,
        content,
        category,
        date
      })
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
      return <TablePosts obj={post} key={post.key} />
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