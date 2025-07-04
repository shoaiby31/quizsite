import React, {useEffect} from 'react'
import Header from '../components/header'
import Features from '../components/features'
import Whoisit from '../components/whoisit'
import Testimonials from '../components/testimonials'
import Contact from '../components/contact'
import { getAuth } from "firebase/auth";





function Homepage() {
  useEffect(() => {
  const auth = getAuth();
  if (auth.currentUser) {
    auth.currentUser.getIdToken().then(token => {
      console.log("ID Token:", token);
    });
  }
}, []);
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
