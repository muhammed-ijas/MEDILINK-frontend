import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "/logo/userSideBeforeHome/logo.png";
import { getProvidersList, getMessages, sendMessage } from "../../api/Chat";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

import { FaMicrophone, FaPaperclip } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";

import chatImage from "../../../public/logo/HomePage/chatImage.png"
import axios from "axios";

import { io, Socket } from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

// Explicitly define the socket type
let socket: Socket;

interface Provider {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Message {
  from: string;
  message: string;
  time: string;
}

interface ApiMessage {
  message: string;
  time: string;
  senderId: string;
}

const Messages = () => {
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);

  //for search provider
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  //messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  //loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //for socket
  const [socketConnected, setSocketConnected] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for the hidden file input

  //for recording
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      };

      recorder.start();

      // Start the recording timer
      setIsRecording(true);
      timerRef.current = setInterval(
        () => setRecordingTime((time) => time + 1),
        1000
      );
    } catch (err) {
      console.error("Error starting audio recording:", err);
    }
  };
  // const startRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     const recorder = new MediaRecorder(stream);
  //     setMediaRecorder(recorder);
  
  //     // Clear the previous audio chunks before starting a new recording
  //     setAudioChunks([]);
  
  //     recorder.ondataavailable = (event) => {
  //       setAudioChunks((prevChunks) => [...prevChunks, event.data]);
  //     };
  
  //     // Ensure the timer starts immediately when recording starts
  //     recorder.onstart = () => {
  //       setIsRecording(true);
  //       timerRef.current = setInterval(
  //         () => setRecordingTime((time) => time + 1),
  //         1000
  //       );
  //     };
  
  //     // Properly handle stopping and resetting the timer
  //     recorder.onstop = async () => {
  //       clearInterval(timerRef.current!);
  //       setRecordingTime(0); // Reset the timer
  
  //       const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
  //       const audioUrl = URL.createObjectURL(audioBlob);
  //       setAudioUrl(audioUrl);
  
  //       // Now, upload the audio file to Cloudinary
  //       await uploadAudio(audioBlob);
  //     };
  
  //     recorder.start();
  //   } catch (err) {
  //     console.error("Error starting audio recording:", err);
  //   }
  // };

  // const stopRecording = () => {
  //   if (mediaRecorder) {
  //     mediaRecorder.stop();
  //   }
  //   setIsRecording(false);
  //   clearInterval(timerRef.current!); 
  //   setRecordingTime(0); // Reset the timer
  // };


const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
  setIsRecording(false);
  clearInterval(timerRef.current!); 
  setRecordingTime(0); // Reset the timer
};

  useEffect(() => {
    if (!mediaRecorder) return;

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      // Now, upload the audio file to Cloudinary
      await uploadAudio(audioBlob);
    };
  }, [audioChunks, mediaRecorder]);

  const uploadAudio = async (audioBlob: Blob) => {
    if (!activeProvider || !activeProvider._id) {
      console.error("No active user selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("upload_preset", "videos_preset");
    formData.append("cloud_name", "dhq8p5oyj");

    try {
      console.log("heey before cloudinary upload response : ");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhq8p5oyj/video/upload",
        formData
      );

      console.log("heey after cloudinary upload response : ", response);

      const audioUrl = response.data.secure_url;

      // Send the audio URL as a message
      const newMessage = await sendMessage(
        userInfo._id,
        activeProvider._id,
        audioUrl
      );
      socket.emit("newmessage", newMessage);

      const messageData = {
        from: "Me",
        message: audioUrl,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prevMessages) => [...prevMessages, messageData]);
    } catch (err) {
      console.error("Error uploading audio:", err);
    }
  };

  const handleSendAudio = () => {
    if (isRecording) {
      stopRecording(); // Stop and upload audio
    } else {
      startRecording(); // Start recording
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connection", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await getProvidersList(userInfo._id);

        setProviders(response);
        setFilteredProviders(response); // Initially set filtered providers as all providers
      } catch (err) {
        setError("No providers available");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "images_preset");
      formData.append("cloud_name", "dhq8p5oyj");

      try {
        setLoading(true);

        // Upload to Cloudinary
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dhq8p5oyj/image/upload",
          formData
        );

        // Get the Cloudinary URL
        const cloudinaryUrl = cloudinaryResponse.data.secure_url;

        // Optional chaining to safely access activeProvider._id
        if (!activeProvider?._id) {
          setError("Active provider not found");
          setLoading(false);
          return;
        }

        // Send the URL as a message
        const response = await sendMessage(
          userInfo._id,
          activeProvider._id,
          cloudinaryUrl
        );
        if (response) {
          socket.emit("newmessage", response);
        }

        const messageData = {
          from: "Me",
          message: cloudinaryUrl, // The image URL instead of text
          time: new Date().toLocaleTimeString(),
        };

        setMessages((prevMessages) => [...prevMessages, messageData]);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setError("Failed to upload file");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (activeProvider) {
      const fetchMessages = async () => {
        try {
          const response = await getMessages(userInfo._id, activeProvider._id);
          const formattedMessages = response.map((msg: ApiMessage) => ({
            ...msg,
            from: msg.senderId === userInfo._id ? "Me" : activeProvider.name,
            time: msg.time || new Date().toLocaleTimeString(),
          }));
          setMessages(formattedMessages);
        } catch (err) {
          setError("Error fetching messages");
        }
      };
      fetchMessages();
    }
  }, [activeProvider]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    if (!activeProvider?._id) {
      setError("Active provider not found");
      return;
    }

    try {
      const response = await sendMessage(
        userInfo._id,
        activeProvider._id,
        newMessage
      );
      console.log("response came hahahah :", response);
      if (response) {
        socket.emit("newmessage", response);
      }
      const messageData = {
        from: "Me",
        message: newMessage,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    } catch (err) {
      setError("Error sending message");
    }
  };

  useEffect(() => {
    // Set up the socket listener for receiving messages
    socket.on("messageRecieved", (newMessage) => {
      console.log("Message received:", newMessage);

      const messageData = {
        from: "",
        message: newMessage, // Assuming newMessage contains {message}
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    // Cleanup function to remove the listener when the component unmounts or re-renders
    return () => {
      socket.off("messageRecieved"); // Remove the listener to avoid duplicates
    };
  }, []);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter providers based on the search term
    const filtered = providers.filter((provider) =>
      provider.name.toLowerCase().includes(value)
    );
    setFilteredProviders(filtered);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-blue-200 to-purple-300">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 flex justify-center">
          <NavLink to="/user/home">
            <img src={logo} alt="Logo" className="h-7 cursor-pointer" />
          </NavLink>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Providers List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <div
                key={provider._id}
                onClick={() => setActiveProvider(provider)}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-200 border rounded-lg ${
                  activeProvider?._id === provider._id ? "bg-gray-200" : ""
                }`}
              >
                <FaUserCircle className="text-gray-400 h-8 w-8 mr-2" />
                <span>{provider.name}</span>
              </div>
            ))
          ) : (
            <p>No providers found</p>
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Navigation Links */}
        <div className="p-4 bg-gray-100 border-b border-gray-200 flex space-x-6">
          <NavLink
            to="/user/home"
            className="text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200"
          >
            Home
          </NavLink>
          <NavLink
            to="/user/services"
            className="text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200"
          >
            Services
          </NavLink>
          <NavLink
            to="/user/appointment"
            className="text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200"
          >
            Search
          </NavLink>
          <NavLink
            to="/user/about"
            className="text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200"
          >
            About
          </NavLink>
          <NavLink
            to="/user/contact"
            className="text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200"
          >
            Contact
          </NavLink>
        </div>

        {/* Chat Header */}
        <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {activeProvider ? activeProvider.name : "Select a provider to chat"}
          </h2>
        </div>

        {/* Chat Messages */}
        {/* <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {activeProvider ? (
            messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.from === "Me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-lg ${
                      msg.from === "Me" ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <small className="text-xs text-gray-500">{msg.time}</small>
                  </div>
                </div>
              ))
            ) : (
              <p>No messages yet. Start the conversation.</p>
            )
          ) : (
            <p>No provider selected</p>
          )}
          {/* Scroll target div */}
        {/* <div ref={messagesEndRef} />
        </div> */}

        {/* Chat Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {activeProvider ? (
            messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.from === "Me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-lg ${
                      msg.from === "Me" ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {/* Check if the message is an image or audio URL */}
                    {msg.message.startsWith("http") &&
                    msg.message.includes("cloudinary") ? (
                      msg.message.match(/\.(jpg|jpeg|png|gif)$/) ? (
                        // If it's an image
                        <img
                          src={msg.message}
                          alt="Sent file"
                          className="max-w-full h-auto rounded-lg"
                        />
                      ) : msg.message.match(/\.(mp3|wav|ogg|webm)$/) ? (
                        // If it's an audio file (including webm)
                        <audio controls>
                          <source src={msg.message} type="audio/webm" />
                          Your browser does not support the audio element.
                        </audio>
                      ) : (
                        // Other media (like videos or unsupported formats)
                        <p>Unsupported media format</p>
                      )
                    ) : (
                      // If it's a text message
                      <p>{msg.message}</p>
                    )}
                    <small className="text-xs text-gray-500">{msg.time}</small>
                  </div>
                </div>
              ))
            ) : (
              <p>No messages yet. Start the conversation.</p>
            )
          ) : (
            <div className="flex justify-center align-middle">
              <img src={chatImage} alt="" className="h-96" />
            </div>
          )}
          {/* Scroll target div */}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        {activeProvider && (
          <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white flex items-center">
            <FaUserCircle className="text-gray-400 h-8 w-8 mr-2" />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex space-x-3 items-center ml-4">
              <button
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full shadow-md transition duration-300 ease-in-out text-gray-600"
                onClick={handleSendMessage}
              >
                <BsFillSendFill className="text-xl" />
              </button>

              {/* Button to handle audio recording */}
              <div className="relative flex flex-col items-center">
                {/* Timer displayed above the button */}
                {isRecording && (
                  <div className="absolute -top-8 flex items-center justify-center bg-gray-200 text-gray-700 font-bold px-2 py-1 rounded-md shadow-lg">
                    <p>{recordingTime}s</p>
                  </div>
                )}

                {/* Recording button */}
                <button
                  onClick={handleSendAudio}
                  className={`p-5 rounded-full shadow-md focus:outline-none 
      transition-transform duration-300 ease-in-out
      ${isRecording ? "bg-red-500 animate-pulse scale-105" : "bg-gray-100"} 
      hover:scale-105 hover:shadow-lg`}
                >
                  {isRecording ? (
                    <div className="bg-white w-4 h-4 rounded-sm"></div> // Red stop icon (square)
                  ) : (
                    <FaMicrophone className="text-xl text-gray-600" />
                  )}
                </button>
              </div>

              {/* <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full shadow-md transition duration-300 ease-in-out text-gray-600 mr-3"
              >
                <FaPaperclip className="text-xl" />
              </button> */}
              <button
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full shadow-md transition duration-300 ease-in-out text-gray-600"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click(); // Trigger the file input only if it's not null
                  }
                }}
              >
                <FaPaperclip className="text-xl" />
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload} // Handle file selection and upload
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
