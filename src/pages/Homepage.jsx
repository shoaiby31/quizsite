import React from 'react'
import Header from '../components/header'
import Features from '../components/features'
import Whoisit from '../components/whoisit'
import Testimonials from '../components/testimonials'
import Contact from '../components/contact'

function Homepage() {
  return (
    <div>
      <Header/>
      <Features/>
      <Whoisit/>
      <Testimonials/>
      <Contact/>
    </div>
  )
}

export default Homepage
