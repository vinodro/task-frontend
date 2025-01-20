import React from "react";
import { Password } from "primereact/password";
import { InputTextarea } from "primereact/inputtextarea";
import {
  UseFormRegister,
  FieldErrors,
  RegisterOptions,
  Control,
  Controller,
} from "react-hook-form";
import { InputText } from "primereact/inputtext"; // Assuming you're using PrimeReact

interface InputComponentProps {
  register?: UseFormRegister<any>; // Use the correct type for register function
  errors: FieldErrors<any>; // Correct error type for IFormInput
  name: string; // Field name (email or password)
  label: string; // Label for the input
  type?: string; // Label for the input
  control?: Control<any>;
  rule?: Object;
  options?: RegisterOptions<any>; // Register options specific to IFormInput
}

function InputComponent({
  register,
  errors,
  name,
  label,
  type,
  rule,
  control,
  options,
}: InputComponentProps) {
  const error = errors[name];

  const input = () => {
    switch (type) {
      case "password":
        return (
          <div>
            <Controller
              name={name}
              control={control}
              rules={rule}
              render={({ field }) => (
                <Password
                  //   {...register(name, options)}
                  {...field}
                  className={`p-inputtext ${error ? "p-invalid" : ""}`}
                  toggleMask={true}
                  feedback={false}
                  placeholder="Enter your password" // Placeholder for password field
                />

                //   <InputText id={name} {...field} className="p-inputtext-sm" />
              )}
            />
            {/* <Password
              {...register(name, options)}
              className={`p-inputtext ${error ? "p-invalid" : ""}`}
              toggleMask={true}
              feedback={false}
              placeholder="Enter your password" // Placeholder for password field
            /> */}
          </div>
        );

      case "text-area":
        return (
          <Controller
            name={name}
            control={control}
            rules={rule}
            render={({ field }) => (
              <InputTextarea
                id="description"
                {...field}
                rows={5}
                cols={30}
                autoResize
                className={`p-inputtext ${
                  errors.description ? "p-invalid" : ""
                }`}
              />
            )}
          />
        );

      default:
        return (
          <Controller
            name={name}
            control={control}
            rules={rule}
            render={({ field }) => (
              <InputText id={name} {...field} className="p-inputtext-sm" />
            )}
          />
        );
    }
  };
  return (
    <div className="flex flex-column pb-2">
      <label>{label}</label>
      {input()}
      {error?.message && (
        <small className="p-error">
          {String(error.message)} {/* Ensure `message` is a string */}
        </small>
      )}
    </div>
  );
}

export default InputComponent;
