import React, { useEffect } from 'react'
import Router from 'next/router'

const Home = () => {

  useEffect(() => {
    Router.push('/main/dashboard')
  
    return () => {}
  }, [])
    
  return null
}


export default Home