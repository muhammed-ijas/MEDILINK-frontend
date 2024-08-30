
import { motion } from "framer-motion";
import aboutImage from "../../../public/logo//HomePage/image7.png";

import homenurseImage from "../../../public/logo/HomePage/homenurseImage.png";

const SPAbout = () => {
  

  return (
    <div>
     

      {/* about section */}
      <section className="relative p-8 bg-white flex flex-col md:flex-row items-center overflow-hidden">
        {/* Diagonal Slice Background */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 80% 100%, 0 100%)",
            zIndex: -1, // Place behind content
          }}
        ></div>

        {/* Black Overlay for Image */}
        <div
          className="absolute inset-0 bg-blue-950"
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


      {/* Goals of Us Section */}
      <section className="relative p-8">
        {/* Background ClipPath */}
        <div
          className="absolute inset-0 bg-blue-950 opacity-90"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 60% 100%, 0 100%)",
            zIndex: -1, // Place behind content
          }}
        ></div>

        {/* Black Overlay for Image */}
        <div
          className="absolute inset-0 bg-blue-950"
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
    </div>
  );
};

export default SPAbout;
