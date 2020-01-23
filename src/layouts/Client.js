import React, { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'

const Header = lazy(() => import('../components/Header'))
const Home = lazy(() => import('../components/Home'))
const About = lazy(() => import('../components/About'))
const Contact = lazy(() => import('../components/Contact'))

export default function Client() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/about'>
            <About />
          </Route>
          <Route path='/contact'>
            <Contact />
          </Route>
        </Switch>
      </Suspense>
    </div>
  )
}