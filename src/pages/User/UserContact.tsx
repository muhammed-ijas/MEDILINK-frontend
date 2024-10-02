

const UserHome = () => {
  return (
    <div>
      <section className="p-8 bg-white text-center mt-10">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg mb-4">
          Have questions or need support? Get in touch with us.
        </p>

        {/* Contact Form */}
        <form
          className="max-w-lg mx-auto space-y-4 mt-5"
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
            className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 "
          >
            Send Message
          </button>
        </form>

        <p className="mt-9 text-blue-500 hover:underline">
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
