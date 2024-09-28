import Api from "../services/axios";
import chatRoutes from "../services/endpoints/ChatEndpoints";

export const getProvidersList = async (userId:string) => {
  console.log(" the id :",userId)
  const response = await Api.post(chatRoutes.getProvidersList,{userId}); 
  console.log("response from backend  :",response)
  return response.data;
};

// Fetch messages between user and provider
export const getMessages = async (userId:string, providerId:string) => {
  console.log("came to getmessages api function ",userId,providerId);
  const response = await Api.post(chatRoutes.getMessages, { userId, providerId });
  console.log("reponse from backend get in api functiokn get messages",response)
  return response.data;
};

// Send a message
export const sendMessage = async (userId:string, providerId:string, message:string) => {
  console.log("came to sendMessage api function ",userId,providerId,message);


  const response = await Api.post(chatRoutes.sendMessage, { userId, providerId, message });
  console.log("reponse from backend get in api functiokn sendMessage",response)

  return response.data;
};



export const SPgetUsersList = async (providerId:string) => {
  console.log("came here to SPgetUsersList providerId ",providerId);
  const response = await Api.post(chatRoutes.SPgetUsersList,{providerId}); 
  return response.data;
};

// Fetch messages between user and provider
export const SPgetMessages = async (providerId:string, userId:string) => {

  console.log("came to getmessages api function ",userId,providerId);
  const response = await Api.post(chatRoutes.SPgetMessages, { userId, providerId });
  console.log("reponse from backend get in api functiokn get messages",response)
  return response.data;
};

// Send a message
export const SPsendMessage = async (providerId:string, userId:string, message:string) => {
  
  console.log("came to sendMessage api function ",userId,providerId,message);


  const response = await Api.post(chatRoutes.SPsendMessage, { providerId, userId, message });

  console.log("reponse from backend get in api functiokn sendMessage",response)

  return response.data;
};