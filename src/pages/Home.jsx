import react from 'react'
import PublicLayout from '../publiclayout/PublicLayout'
import HeroSection from './HeroSection'
import FeaturedEvent from './FeatureEvent'


export default function Home() {
    return (
        <>
            <PublicLayout>
                <HeroSection />
                <FeaturedEvent />
            </PublicLayout>
        </>
    )
}