import React, { Component } from 'react'
import firebase from '../firebase'
// import { EditorState, convertToRaw } from 'draft-js'
// import { Editor } from 'react-draft-wysiwyg'
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CKEditor from '@ckeditor/ckeditor5-react'

export default class AddPost extends Component {
  constructor(props){
    super(props)
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeCategory = this.onChangeCategory.bind(this)
    //this.onChangeContent = this.onChangeContent.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.ref = firebase.firestore().collection('posts')
    this.state = {
      title: '',
      category:'',
      content: '',
      date: '',
      //editorState: EditorState.createEmpty()
    }
  }

  componentDidMount(){
    let date = new Date()
    let formatDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()+ " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() 
    this.setState({
      date: formatDate.toString()
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
  /*
  onChangeContent(editorState){
    this.setState({
      editorState,
      content: convertToRaw(this.state.editorState.getCurrentContent())
    })
  }
  */
  onSubmit(e){
    e.preventDefault()
    const { title, category, content, date } = this.state
    this.ref.add({ title, category, content, date })
      .then((docRef) => {
        this.setState({
          title: '',
          category: '',
          content: '',
          date: ''
        })
        alert('Successfully Add a post!')
        this.props.history.push('/posts')
      })
      .catch(error => {
        alert('Failed to add a post : ', error)
      })  
  }

  render() {
    return(
      <div className='pa4 bg-white'>
        <h3 className='fw5'>Add Post</h3>
        
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
            {/* <Editor 
              editorState={this.state.editorState} 
              onEditorStateChange={this.onChangeContent} 
              wrapperClassName="demo-wrapper" 
              editorClassName="editer-content"
            /> */}
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
            <input type='submit' value='Add Post' className='f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue' />
          </div>
        </form> 
      </div>
    )
  }
}

