import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./Components/Chat-container/ChatContainer";
import EmptyContainer from "./Components/Empty-container/EmptyContainer";
import ContactContainer from "./Components/Contacts-container/ContactContainer";

const Chat = () => {
  const { userInfo, selectedChatType, selectedChatData } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.profileSetUp) {
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactContainer />
      {selectedChatType === undefined ? <EmptyContainer /> : <ChatContainer />}
    </div>
  );
};

export default Chat;
