import Footer from "@/components/Footer";
import Cities from "@/components/home/Cities";
import Garanties from "@/components/home/Garanties";
import Hero from "@/components/home/Hero";
import NavBar from "@/components/home/NavBar";
export default function Home() {
  return (
    <div style={{marginTop: '-119px'}}>
      <NavBar />
      <Hero />
      <Cities />
      <Garanties />
      <Footer />
    </div>
  );
}
