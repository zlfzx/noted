import React from 'react'
import {createRoot, } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './style.css'
import App from './App'
import Add from './Add'
import { Store } from './store'

const container = document.getElementById('root')

const root = createRoot(container)

root.render(
    // <React.StrictMode>
    <Store>
        <HashRouter basename={'/'}>
            <Routes>
                <Route path="/" element={<App />} exact />
                <Route path="/add" element={<Add />} />
                <Route path="/detail/:id" element={<Add />} />
            </Routes>
        </HashRouter>
    </Store>
    // </React.StrictMode>
)
