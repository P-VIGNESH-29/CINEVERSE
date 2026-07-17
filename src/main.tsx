import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store/store.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>

      <ThemeProvider>
        <App />
      </ThemeProvider>
      </HashRouter>
    </Provider>
  </StrictMode>,
)
