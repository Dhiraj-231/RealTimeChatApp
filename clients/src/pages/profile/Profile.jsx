import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Helper } from "@/utils/Helper";
import { apiClient } from "@/lib/api-clients";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/Constants";
import { toast } from "sonner";
const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    image: null,
    hovered: false,
    selectedColor: 0,
  });
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (userInfo.profileSetUp) {
      setForm({
        ...form,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        selectedColor: userInfo.color,
      });
    }
    if (userInfo.image) {
      setForm({
        ...form,
        image: `${HOST}/${userInfo.image}`,
      });
    } else {
      setForm({
        ...form,
        image: null,
      });
    }
  }, [userInfo]);
  const saveChanges = async () => {
    if (Helper.validateProfile(form)) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName: form.firstName,
            lastName: form.lastName,
            color: form.selectedColor,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setUserInfo(response.data.content.data);
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleNavigate = () => {
    if (userInfo.profileSetUp) {
      navigate("/chat");
    } else {
      toast.error("Please set up your profile first");
    }
  };
  const handleFileInputRef = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Profile image updated successfully");
      }
    }
  };
  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });

        toast.success("Profile image deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
            onClick={handleNavigate}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setForm({ ...form, hovered: true })}
            onMouseLeave={() => setForm({ ...form, hovered: false })}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {form.image ? (
                <AvatarImage
                  src={form.image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    form.selectedColor
                  )}`}
                >
                  {form.firstName
                    ? form.firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {form.hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer"
                onClick={form.image ? handleDeleteImage : handleFileInputRef}
              >
                {form.image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg ,.jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                readOnly
              />
            </div>
            <div className="w-full">
              <Input
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholder="First Name"
                type="text"
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                value={form.firstName}
              />
            </div>
            <div className="w-full">
              <Input
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholder="Last Name"
                type="text"
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                value={form.lastName}
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    form.selectedColor === index
                      ? "outline outline-white/80 outline-2"
                      : ""
                  }`}
                  key={index}
                  onClick={() => setForm({ ...form, selectedColor: index })}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Change
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
