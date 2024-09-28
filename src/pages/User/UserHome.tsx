import { useNavigate } from "react-router-dom";
import frontpageImage from "../../../public/logo/userSideBeforeHome/frontPageImage.png";
import { motion } from "framer-motion";
import aboutImage from "../../../public/logo//HomePage/image7.png";
import hospitalImage from "../../../public/logo/HomePage/hospitalImage.png";
import ambulanceImage from "../../../public/logo/HomePage/ambulanceImage2.png";
import homenurseImage from "../../../public/logo/HomePage/homenurseImage.png";
import clinickImage from "../../../public/logo/HomePage/clinickImage.png";
import { useEffect } from "react";

const UserHome = () => {
  const navigate = useNavigate();
  const handleServices = () => {
    navigate("/user/services");
  };

  const handleConnect = () => {
    navigate("/user/contact");
  };

  useEffect(() => {
    const cards = document.querySelectorAll(".service-card");

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.1}s`;
      card.classList.add("service-card-enter");
    });

    const revealCards = () => {
      cards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < window.innerHeight) {
          card.classList.add("service-card-enter-active");
        }
      });
    };

    window.addEventListener("scroll", revealCards);
    revealCards();

    return () => {
      window.removeEventListener("scroll", revealCards);
    };
  }, []);

  return (
    <div>
     {/* Full-Screen Image with Medilink Name */}
<section className="relative w-full h-screen bg-cover bg-center">
  <motion.div
  className="absolute inset-0 bg-black"
  style={{
    clipPath: "polygon(0 0, 100% 0, 60% 10%, 70% 100%, 0 100%)",
  }}
  initial={{
    clipPath: "polygon(0 0, 100% 0, 60% 15%, 70% 95%, 0 100%)",
  }}
  animate={{
    clipPath: "polygon(0 0, 100% 0, 60% 30%, 70% 80%, 0 100%)", 
  }}
  transition={{
    duration: 6, // Duration for smoother animation
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "mirror", // Smooth animation in both directions
  }}
/>

  <div className="flex flex-col md:flex-row h-full relative">
    {/* Left content */}
    <div className="relative md:w-1/2 h-full flex flex-col justify-center items-center text-center p-6 md:p-10">
      <motion.div
        className="relative z-10 flex flex-col justify-center h-full px-4 md:px-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }} // Smoother opacity and position transition
      >
        <motion.h1
          className="text-white text-4xl md:text-5xl lg:text-7xl font-bold mb-4 text-shadow"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }} // Smooth text appearance
        >
          MEDILINK
        </motion.h1>
        <motion.p
          className="text-sm md:text-lg text-gray-300 mb-6 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} // Smooth text appearance with delay
        >
          At MediLink, we understand the challenges of finding reliable
          healthcare services. Our platform is designed to make your
          healthcare journey smoother by connecting you with a wide
          network of service providers. Whether you’re looking for medical
          care, booking appointments, or seeking specialized services,
          MediLink is here to help.
        </motion.p>

        <div className="flex flex-col gap-4">
          <motion.button
            onClick={handleServices}
            className="w-full md:w-auto border border-gray-400 text-white font-semibold py-2 px-4 rounded-lg mb-4 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-300"
            whileHover={{
              scale: 1.05,
              backgroundColor: "#4b5563",
              color: "#f9fafb",
            }}
            transition={{ duration: 0.3 }} // Smooth hover transition
          >
            Find Healthcare Services
          </motion.button>
          <motion.button
            onClick={handleConnect}
            className="w-full md:w-auto border border-gray-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors duration-300"
            whileHover={{
              scale: 1.05,
              backgroundColor: "#4b5563",
              color: "#f9fafb",
            }}
            transition={{ duration: 0.3 }} // Smooth hover transition
          >
            Connect With Us
          </motion.button>
        </div>
      </motion.div>
    </div>

    {/* Right part */}
    <div className="md:w-1/2 flex justify-center items-center relative z-10">
      <motion.img
        className="w-full h-full object-cover transition-transform transform hover:scale-105"
        src={frontpageImage}
        alt="Healthcare"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }} // Smooth image appearance
      />
    </div>
  </div>
</section>



      {/* about section */}
      <section className="relative p-8 bg-white flex flex-col md:flex-row items-center overflow-hidden">
        {/* Diagonal Slice Background */}
        <div
          className="absolute inset-0 bg-black opacity-30"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 60% 100%, 0 100%)",
            zIndex: -1, // Place behind content
          }}
        ></div>

        {/* Black Overlay for Image */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            clipPath: "polygon(0 50%, 100% 0, 100% 60%, 50% 100%, 0 100%)",
            zIndex: 0,
          }}
        ></div>

        {/* Left Side - Image */}
        <div className="md:w-1/2 flex justify-center mb-8 md:mb-0 relative ">
          <img
            src={aboutImage}
            alt="About Medilink"
            className="w-4/5 h-auto object-cover transition-transform transform hover:scale-105"
          />
        </div>

        {/* Right Side - Text */}
        <div className="md:w-1/2 text-center md:text-left p-4 md:p-8 relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-white">About Medilink</h2>
          <p className="text-lg text-white leading-relaxed z-10">
            We bring together various medical services like medical shops,
            hospitals, clinics, ambulance services, and home nurses under one
            roof. Our aim is to provide seamless and comprehensive care for
            everyone.
          </p>
        </div>
      </section>

      {/* Services Section */}
      {/* Hospital Service */}
      <div className="p-10 justify-center text-center mt-8">
        <h1 className="text-4xl font-bold">Our Services</h1>
      </div>
      <section className="p-8">
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hospital Card */}
          <div className="service-card  p-6 rounded-lg shadow-md flex flex-col  hover:shadow-2xl items-center transform transition-transform hover:scale-105 bg-white text-black  ">
            <img
              src={hospitalImage}
              alt="Hospital Services"
              className="w-40 h-40 object-cover rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Hospital Services</h2>
            <p className="text-center  mb-4">
              Our hospital services provide comprehensive care for various
              medical needs. From routine check-ups to emergency care, our
              facilities are equipped with state-of-the-art technology and
              staffed by experienced professionals.
            </p>
            <a href="/user/services" className="text-blue-500 hover:underline">
              Learn More
            </a>
          </div>

          {/* Ambulance Card */}
          <div className="service-card  p-6 rounded-lg shadow-md flex flex-col  hover:shadow-2xl items-center transform transition-transform hover:scale-105 bg-white text-black ">
            <img
              src={ambulanceImage}
              alt="Ambulance Services"
              className="w-40 h-40 object-cover rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Ambulance Services</h2>
            <p className="text-center  mb-4">
              Our ambulance services ensure quick and efficient transportation
              to medical facilities. Equipped with advanced life support systems
              and staffed by skilled paramedics, we provide reliable emergency
              medical transport.
            </p>
            <a href="/user/services" className="text-blue-500 hover:underline">
              Learn More
            </a>
          </div>

          {/* Home Nursing Card */}
          <div className="service-card  p-6 rounded-lg shadow-md  hover:shadow-2xl flex flex-col items-center transform transition-transform hover:scale-105  bg-white text-black ">
            <img
              src={homenurseImage}
              alt="Home Nursing Services"
              className="w-40 h-40 object-cover rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Home Nursing Services</h2>
            <p className="text-center  mb-4">
              Our home nursing services offer personalized care in the comfort
              of your home. Our trained nurses provide a range of services,
              including medication administration, wound care, and assistance
              with daily activities.
            </p>
            <a href="/user/services" className="text-blue-500 hover:underline">
              Learn More
            </a>
          </div>

          {/* Clinic Card */}
          <div className="service-card  p-6 rounded-lg shadow-md hover:shadow-2xl flex flex-col items-center transform transition-transform hover:scale-105 bg-white text-black ">
            <img
              src={clinickImage}
              alt="Clinic Services"
              className="w-40 h-40 object-cover rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Clinic Services</h2>
            <p className="text-center  mb-4">
              Our clinics offer specialized medical care with a focus on
              patient-centered services. From preventive care to treatment of
              acute and chronic conditions, our clinics are staffed by
              experienced healthcare professionals.
            </p>
            <a href="/user/services" className="text-blue-500 hover:underline">
              Learn More
            </a>
          </div>

        </div>
      </section>

      <style >{`
        .service-card {
          transition: transform 0.3s ease-in-out;
        }

        .service-card-enter {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }

        .service-card-enter-active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

{/* Goals of Us Section */}
<section className="relative p-8">
  {/* Background ClipPath */}
  <div
          className="absolute inset-0 bg-black opacity-90"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 60% 100%, 0 100%)",
            zIndex: -1, // Place behind content
          }}
        ></div>

        {/* Black Overlay for Image */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            clipPath: "polygon(0 50%, 100% 0, 100% 60%, 50% 100%, 0 100%)",
            zIndex: 0,
          }}
        ></div>

       
  
  <div className="flex items-center justify-between max-w-6xl mx-auto text-white relative z-10">
    {/* Text Section */}
    <div className="w-full md:w-1/2 p-4">
      <h2 className="text-3xl font-bold mb-4">Our Goals</h2>
      <p className="text-lg">
        At Medilink, our goal is to transform the healthcare experience by
        seamlessly integrating a variety of services into a single,
        user-friendly platform. We are dedicated to continuously enhancing
        our offerings to better serve our users and partners. Our future
        plans include expanding our network of service providers,
        incorporating advanced features for more efficient service
        delivery, and ensuring a high standard of quality and reliability.
        We aim to be the go-to solution for all healthcare needs,
        fostering a healthier and more connected community.
      </p>
    </div>

    {/* Image Section */}
    <motion.div
      className="w-full md:w-1/2 p-4"
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1 }}
    >
      <img
        src={homenurseImage}
        alt="Our Goals"
        className="w-full h-auto object-cover rounded-lg"
      />
    </motion.div>
  </div>
</section>


      {/* Contact Section */}
     {/* Contact Section */}
<section className="p-8 bg-white text-center">
  <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
  <p className="text-lg mb-4">
    Have questions or need support? Get in touch with us.
  </p>

  {/* Contact Form */}
  <form 
    className="max-w-lg mx-auto space-y-4"
    action="/send-message" // Change to your form handling endpoint
    method="POST"
  >
    <div className="flex flex-col space-y-2">
      <label htmlFor="name" className="text-left">
        Name
        <input 
          type="text" 
          id="name" 
          name="name" 
          placeholder="Your Name" 
          className="p-2 border border-gray-300 rounded-md w-full" 
          required 
        />
      </label>
      
      <label htmlFor="email" className="text-left">
        Email
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="Your Email" 
          className="p-2 border border-gray-300 rounded-md w-full" 
          required 
        />
      </label>
      
      <label htmlFor="message" className="text-left">
        Message
        <textarea 
          id="message" 
          name="message" 
          placeholder="Your Message" 
          className="p-2 border border-gray-300 rounded-md w-full" 
          rows="4" 
          required 
        ></textarea>
      </label>
    </div>
    
    <button 
      type="submit" 
      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Send Message
    </button>
  </form>

  <p className="mt-4 text-blue-500 hover:underline">
    <a href="/user/contact">Contact Page</a>
  </p>
</section>


      <div className="fixed bottom-4 right-4">
        <a
          href="/user/appointment"
          className="bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Book Appointment
        </a>
      </div>
    </div>
  );
};

export default UserHome;
