import React, { Component } from 'react'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import firebase from '../firebase'

export default class EditPost extends Component {
  constructor(props){
    super(props)
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeCategory = this.onChangeCategory.bind(this)
    this.onChangeContent = this.onChangeContent.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      key: '',
      title: '',
      category: '',
      content: '',
      date: '',
      editorState: EditorState.createEmpty()
    }
  }

  componentDidMount(){
    const ref = firebase.firestore().collection('posts').doc(this.props.match.params.id)
    ref.get().then((doc) => {
      if (doc.exists){
        const post = doc.data()
        const postContent = EditorState.createWithContent(convertFromRaw(JSON.parse(post.content)))
        let date = new Date()
        let formatDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()+ " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() 
        this.setState({
          key: doc.id,
          title: post.title,
          category: post.category,
          content: postContent,
          date: formatDate.toString()
        })
      } else {
        console.log('No document!')
      }
    })
  }

  onChangeTitle(e){
    this.setState({
      title: e.target.value
    })
  }

  onChangeCategory(e){
    this.setState({
      category: e.target.value
    })
  }

  onChangeContent(editorState){
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    //const content = JSON.stringify(convertContent)
    this.setState({
      editorState,
      content
    })
    console.log(this.state.content)
  }

  onSubmit(e){
    e.preventDefault()
    const { title, category, content, date } = this.state

    const updateRef = firebase.firestore().collection('posts').doc(this.state.key)
    updateRef.set({
      title, category, content, date
    })
    .then((docRef) => {
      this.setState({
        key: '',
        title: '',
        category: '',
        content: '',
        date: ''
      })
      alert('Successfully edited!')
      this.props.history.push('/posts')
    })
    .catch(error => {
      alert('Error : ', error)
    })  
  }

  render(){
    return(
      <div className='pa4 bg-white'>
        <h3 className='fw5'>Edit Post</h3>

        <form className='mt2 pa3' onSubmit={this.onSubmit}>
          <div className='cf mh3 pa3'>
            <label className='fw1 db ma2'>Title</label>
            <input value={this.state.title} onChange={this.onChangeTitle} className='db w-80 pa2 ma2 b--black-50 ba' />
          </div>
          <div className='cf mh3 pa3'>
            <label className='fw1 db ma2'>Category</label>
            <input value={this.state.category} onChange={this.onChangeCategory} className='db w-80 pa2 ma2 b--black-50 ba' />
          </div>
          <div className='cf mh3 pa3'>
            <label className='db fw1 ma2'>Content</label>
            <Editor 
              editorState={this.state.content} 
              onEditorStateChange={this.onChangeContent} 
              wrapperClassName="demo-wrapper" 
              editorClassName="editer-content"
            />
          </div>
          
          <div className='cf mh3 pa3'>
            <input type='submit' value='Edit Post' className='f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue' />
          </div>
        </form> 
      </div>
    )
  }
}