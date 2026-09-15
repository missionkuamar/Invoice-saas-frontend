// src/pages/Home.jsx
import React, { useEffect } from 'react';
import Layout from './Layout';
import Hero from './sections/Hero';
import Stats from './sections/Stats';
import Features from './sections/Features';
import Pricing from './sections/Pricing';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import CTA from './sections/CTA';

const Home = () => {
    useEffect(() => {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            });
        });
    }, []);

    return (
        <Layout>
            <Hero />
            <Stats />
            <Features />
            <Pricing />
            <Testimonials />
            <FAQ />
            <CTA />
        </Layout>
    );
};

export default Home;