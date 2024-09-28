import React from 'react'
import { Route, Routes } from "react-router-dom";

import PageLogin from "../Page/Login/PageLogin";
function Guest() {

    return (
        <>
            <div className="App">
                <Routes>
                    <Route path="/" element={<PageLogin />} />
                    <Route path="*" element={<PageLogin />} />
                </Routes>
            </div>
        </>
    )
}

export default Guest