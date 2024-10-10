import { motion } from "framer-motion";
import aboutImage from "/logo/HomePage/image7.png";
import homenurseImage from "/logo/HomePage/homenurseImage.png";
import { useEffect } from "react";

const UserHome = () => {
  
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
    <div>
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
          rows={4}
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


      {/* Appointment Button */}
      <div className="fixed bottom-4 right-4">
        <a
          href="/user/services"
          className="bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Book Appointment
        </a>
      </div>
    </div>
  );
};

export default UserHome;
