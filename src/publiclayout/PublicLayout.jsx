import React, { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const PublicLayout = ({ children }) => {

    return (
        <div className='min-h-screen'>
            <Navigation />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default PublicLayout