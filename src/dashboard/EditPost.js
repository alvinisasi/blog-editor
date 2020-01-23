import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import firebase from '../firebase'

export default class EditPost extends Component {
  constructor(props){
    super(props)
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeCategory = this.onChangeCategory.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      key: '',
      title: '',
      category: '',
      content: '',
      date: ''
    }
  }

  componentDidMount(){
    const ref = firebase.firestore().collection('posts').doc(this.props.match.params.id)
    ref.get().then((doc) => {
      if (doc.exists){
        const post = doc.data()
        let date = new Date()
        let formatDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()+ " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() 
        this.setState({
          key: doc.id,
          title: post.title,
          category: post.category,
          content: post.content,
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
            <CKEditor
              className='db border-box hover-black w-100 ba b--black-50 pa2 br2 mb2' id='editor'
              editor={ ClassicEditor }
              onInit={ editor => {
                // You can store the "editor" and use when it is needed.
                console.log( 'Editor is ready to use!', editor );
              } }
              onChange={ ( event, editor ) => {
                const data = editor.getData();
                this.setState({content: data})
              } }
              onBlur={ ( event, editor ) => {
                console.log( 'Blur.', editor );
              } }
              onFocus={ ( event, editor ) => {
                console.log( 'Focus.', editor );
              } }
            />
            {/* <textarea value={this.state.content} onChange={this.onChangeContent} className='db w-80 pa2 ma2 b--black-50 ba'></textarea> */}
          </div>
          
          <div className='cf mh3 pa3'>
            <input type='submit' value='Edit Post' className='f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue' />
          </div>
        </form> 
      </div>
    )
  }
}