import Api from "../services/axios";
import chatRoutes from "../services/endpoints/ChatEndpoints";

export const getProvidersList = async (userId:string) => {
  const response = await Api.post(chatRoutes.getProvidersList,{userId}); 
  return response.data;
};


// Fetch messages between user and provider
export const getMessages = async (userId:string, providerId:string) => {
  const response = await Api.post(chatRoutes.getMessages, { userId, providerId });
  return response.data;
};


// Send a message
export const sendMessage = async (userId:string, providerId:string, message:string) => {
  const response = await Api.post(chatRoutes.sendMessage, { userId, providerId, message });
  return response.data;
};



export const SPgetUsersList = async (providerId:string) => {
  const response = await Api.post(chatRoutes.SPgetUsersList,{providerId}); 
  return response.data;
};


// Fetch messages between user and provider
export const SPgetMessages = async (providerId:string, userId:string) => {
  const response = await Api.post(chatRoutes.SPgetMessages, { userId, providerId });
  return response.data;
};

// Send a message
export const SPsendMessage = async (providerId:string, userId:string, message:string) => {

  const response = await Api.post(chatRoutes.SPsendMessage, { providerId, userId, message });

  return response.data;
};