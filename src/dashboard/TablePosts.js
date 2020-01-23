
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import firebase from '../firebase'

class TablePosts extends Component {
  constructor(props){
    super(props)
    this.state = {
      posts: [],
      key: ''
    }
  }
  
  delete(id){
    firebase.firestore().collection('posts').doc(id).delete().then(() => {
      alert('Post successfully deleted!');
    }).catch((error) => {
      alert('Error removing post: ' + error);
    });
  }
  

  render() {
    return (
        <tr>
          <td className='pv3 pr3 bb b--black-20'>
            {this.props.obj.title}
          </td>
          <td className='pv3 pr3 bb b--black-20'>
            {this.props.obj.category}
          </td>
          <td className='pv3 pr3 bb b--black-20'>
            {this.props.obj.date}
          </td>
          <td className='pv3 bb b--black-20'>
            <Link to={`/edit-post/${this.props.obj.key}`} className="f6 link dim br2 ph3 pv1 mb1 dib white bg-blue">Edit</Link>
          </td>
          <td className='pv3 bb b--black-20'>
            <Link to={'/posts'} onClick={this.delete.bind(this, this.props.obj.key)} className="f6 link dim br2 ph3 pv1 mb1 dib white bg-red">Delete</Link>
          </td>
        </tr>
    );
  }
}

export default TablePosts;