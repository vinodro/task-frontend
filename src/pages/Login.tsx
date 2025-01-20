import React, { useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import InputComponent from "../component/input";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { AxiosError } from "axios";

interface IFormInput {
  name?: string;
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>();
  const navigate = useNavigate(); // Initialize navigate

  const onSubmit = async (e: IFormInput) => {
    const { email, password } = e;
    try {
      const response = await axios.post("/auth/login", { email, password });
      if (
        response.data.message ==
        "Account is not verified. Please check your email for a verification code."
      ) {
        alert("Your Account verification code has send kindly check your mail");
      }
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (accessToken) {
        navigate("/tasks");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        alert(error?.response?.data?.message || "Invalid credentials");
      }
    }
  };

  return (
    <div className="flex align-items-center flex-column">
      <h2>Login</h2>
      <div className="w-30rem">
        <InputComponent
          // register={register}
          errors={errors}
          name="email" // Specify field name
          label="Email"
          control={control}
          rule={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Please enter a valid email address",
            },
          }}
          options={{ required: "Email is required" }} // Validation options
        />
        <InputComponent
          // register={register}
          errors={errors}
          name="password" // Specify field name
          label="Password"
          type="password"
          control={control}
          rule={{
            required: "Password is required",
          }}
        />
        <Button
          label="Login"
          type="button"
          className="p-button-primary"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
      <div className="mt-3 flex align-items-center">
        <div>New user? </div>
        <Button
          label="Register"
          className="p-button-link"
          onClick={() => navigate("/register")}
        />
      </div>
    </div>
  );
};

export default Login;
