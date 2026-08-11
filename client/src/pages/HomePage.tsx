import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Services from "../components/home/Services";
import Barbers from "../components/home/Barbers";
import Gallery from "../components/home/Gallery";
import Location from "../components/home/Location";
import CtaBanner from "../components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Barbers />
      <Gallery />
      <Location />
      <CtaBanner />
    </>
  );
}
