import { motion } from "framer-motion";
import hospitalImage from "../../../public/logo/HomePage/hospitalImage.png";
import ambulanceImage from "../../../public/logo/HomePage/ambulanceImage2.png";
import homenurseImage from "../../../public/logo/HomePage/homenurseImage.png";
import clinickImage from "../../../public/logo/HomePage/clinickImage.png";
import { useEffect } from "react";

const UserHome = () => {
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

      <style>{`
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
