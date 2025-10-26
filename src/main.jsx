import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/buttons.css';
import './styles/header.css';
import './styles/statsbar.css';
import './styles/listcard.css';
import './styles/checkbox.css';
import './styles/progress.css';
import './styles/task.css';

import './styles/listpage.css';
import './styles/modal.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
