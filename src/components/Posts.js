import React, {Component} from 'react'
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import firebase from '../firebase.js'
//import $ from 'jquery'
class Posts extends Component {
  constructor(props){
    super(props)
    this.ref = firebase.firestore().collection('posts')
    this.unsubscribe = null
    this.state = {
      posts: [],
      date: new Date()
    }
  }

  convertJSONFromContent = (text) =>{
    stateToHTML(convertFromRaw(JSON.parse(text)))
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
  
  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
    //$('#content').html(this.state.content)
  }

  render(){
    const posts = this.state.posts
    const contentlist = posts.map(post => 
      <article className='posts pv4 bt bb b--black-10 ph3 ph0-l' key={post.key}>
        <div className='flex flex-column flex-row-ns'>
          <div className='w-100 w-60-ns pr3-ns order-2 order-1-ns'>
            <h1 className='f3 mt0 lh-title'>{post.title}</h1>
            <p className='f5 f4-l lh-copy i'>{post.category}</p>
            <div className='f5 f4-l lh-copy' id='content'>{post.content}</div>
            {/* <div className='f5 f4-l lh-copy' dangerouslySetInnerHTML={{ __html: this.convertJSONFromContent(post.content)}}>  </div> */}
          </div>
          <div className='pl3-ns order-1 order-2-ns mb4 mb0-ns w-100 w-40-ns'>
            <img src='http://mrmrs.github.io/photos/cpu.jpg' className='db' alt='A dimly lit room with a computer interface terminal.' />
          </div>
        </div>
        <p className="f6 lh-copy gray mv0">By <span className="ttu">Alvin Miftah</span></p>
        <time className="f6 db gray">{post.date}</time>
      </article>    
    )
    return(
      <div>
        {contentlist}
      </div>
    )
  }
}
 
export default Posts