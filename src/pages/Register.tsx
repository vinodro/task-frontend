import React from "react";
import { useForm } from "react-hook-form";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import InputComponent from "../component/input";
import { AxiosError } from "axios";

interface IFormInput {
  name?: string;
  email: string;
  password: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>();
  const [message, setMessage] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: IFormInput) => {
    try {
      const response = await axios.post("/auth/register", data);
      setMessage(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // AxiosError type with response
        setMessage(error.response?.data?.message || "Invalid credentials");
        error.response?.data?.message && alert(error.response?.data?.message);
      } else {
        // General error handling if it's not an AxiosError
        setMessage("An unexpected error occurred.");
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex align-items-center flex-column">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-30rem">
        <InputComponent
          register={register}
          errors={errors}
          name="name" // Specify field name
          label="Name"
          control={control}
          rule={{
            required: "Email is required",
          }}
        />
        <InputComponent
          register={register}
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
          register={register}
          errors={errors}
          name="password" // Specify field name
          label="Password"
          type="password"
          control={control}
          rule={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            },
          }}
        />
        <Button label="Register" type="submit" className="p-button-primary" />
      </form>
      {/* {message && <p>{message}</p>} */}
      <div className="mt-3 flex align-items-center">
        <div>Existing user? </div>
        <Button
          label="Login"
          className="p-button-link"
          onClick={() => navigate("/login")}
        />
      </div>
    </div>
  );
};

export default Register;
