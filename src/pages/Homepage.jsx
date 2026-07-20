import React from 'react'
import Header from '../components/header'
import Features from '../components/features'
import Whoisit from '../components/whoisit'
import Testimonials from '../components/testimonials'
import Contact from '../components/contact'
import AnnouncementBar from "../components/AnnouncementBar";
import AboutSmartEducator from '../components/AboutSmartEducator'
import HowSmartEducatorWorks from '../components/HowSmartEducatorWorks'


function Homepage() {
  return (
    <div>
      <AnnouncementBar />
      <Header/>
      <AboutSmartEducator/>
      <HowSmartEducatorWorks/>
      <Features/>
      <Whoisit/>
      <Testimonials/>
      <Contact/>
    </div>
  )
}

export default Homepage
