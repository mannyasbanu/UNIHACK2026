import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#09090b',
      color: 'white',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'white', fontSize: '40px', marginBottom: '12px' }}>
        News Sentiment Trading Dashboard
      </h1>
      <p style={{ color: '#a1a1aa', fontSize: '18px' }}>
        This is the frontend for out UNIHACK project.
      </p>
    </div>
  )
}

export default App
