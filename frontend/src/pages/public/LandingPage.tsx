import Navbar from '../../components/Navbar';
import PracticeAreas from '../../components/PracticeAreas';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reliable Legal Solutions in Kenya</h1>
          <p className="text-xl mb-8">Professional legal services tailored to your needs.</p>
          <Link to="/booking" className="bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition">
            Book a Consultation
          </Link>
        </div>
      </section>

      <PracticeAreas />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} WakiliSmart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
