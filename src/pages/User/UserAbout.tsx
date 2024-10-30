import { motion } from "framer-motion";
import aboutImage from "/logo/HomePage/image7.png";
import { useEffect } from "react";

const UserAbout = () => {

  useEffect(() => {
    const cards = document.querySelectorAll(".service-card");

    cards.forEach((card, index) => {
      const cardElement = card as HTMLElement;
      cardElement.style.transitionDelay = `${index * 0.1}s`;
      cardElement.classList.add("service-card-enter");
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}  // Start slightly below and transparent
      animate={{ opacity: 1, y: 0 }}   // End at normal position and fully opaque
      transition={{ duration: 0.6, ease: "easeOut" }}  // Smooth transition
    >
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

      {/* Appointment Button */}
      <div className="fixed bottom-4 right-4">
        <a
          href="/user/services"
          className="bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Book Appointment
        </a>
      </div>
    </motion.div>
  );
};

export default UserAbout;
