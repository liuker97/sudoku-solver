import * as React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SolvePage from "../SolvePage/SolvePage";

const pages = [
    {
        label: 'Solve',
        route: '/solve',
        component: <SolvePage />,
    },
]
export default function Page() {
    return (
        <div className="d-flex flex-row h-100">
            <Router>
                <Routes>
                    {pages.map((page, index) => (
                        <Route key={index} path={page.route} element={page.component} />
                    ))}
                </Routes>
            </Router>
        </div>
    )
}
