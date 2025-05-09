import React from 'react'
import PublicQuizzes from '../components/Quizzes/publicquizzes'
// import QuizHeader from '../components/Quizzes/quizheader'
import Header from '../components/header'



function BrowseQuizzes() {
  return (
    <div>
      <Header/>
      <PublicQuizzes />
    </div>
  )
}

export default BrowseQuizzes
