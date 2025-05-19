import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import React, { Fragment } from "react";

function App() {
  return (
    <Fragment>
      <Navbar />
      <HeroSection />
      <Pricing />
      <Footer />
    </Fragment>
  );
}

export default App;
