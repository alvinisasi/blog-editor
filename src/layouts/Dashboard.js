import React, { lazy, Suspense } from 'react'
import styled from 'styled-components'
import { NavLink, Switch, Route } from 'react-router-dom'

const ListPosts = lazy(() => import('../dashboard/ListPosts'))
const AddPost = lazy(() => import('../dashboard/AddPost'))
const EditPost = lazy(() => import('../dashboard/EditPost'))

const Sidebar = styled.div`
  margin: 0;
  padding: 0;
  width: 250px;
  overflow: auto;
  position: fixed;
  height: 100%;
  background-color: #357edd;
`

const MenuLink = styled(NavLink)`
  text-decoration: none;
  color: white;
  display: block;
  padding: 0.5em;
  margin-bottom: 1em;
  margin-left: 0.8em;
  margin-right: 0.8em;
  &:hover {
    color: black;
    background-color: white;
    border-radius: 4em 4em 4em 4em;
  }
  &.active {
    color: #000;
    background-color: #FFD700;
    border-radius: 4em 4em 4em 4em;
    text-decoration: none;
  }
`

const Content = styled.div`
  margin-left: 250px;
  padding: 10px;
  
  background-color: #fbf1a9;
`

export default function Dashboard(){
  return (
    <div>
      <Sidebar>
        <div className='mt4-ns'>
          <h3 className='white db mt3 mb4 mh3'>Dashboard</h3>
          <MenuLink to='/posts' activeClassName='active'> Posts</MenuLink>
          <MenuLink to='/add-post' activeClassName='active'> Add Post</MenuLink>
        </div>
      </Sidebar>
      <Content>
        <h2 className='ma4'>Welcome to Dashboard!</h2>
        <Switch>
          <Suspense fallback={<div>Loading...</div>}>
            <Route path='/posts' component={ListPosts} />
            <Route path='/add-post' component={AddPost} />
            <Route path='/edit-post/:id' component={EditPost} />
          </Suspense>
        </Switch>
      </Content>
    </div>
  )
}

