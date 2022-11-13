import { Input, PasswordInput, Button } from "@mantine/core";
import { useState } from "react";
import styles from "./register.module.scss";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../AuthProvider";

const Register = () => {
  const [newUserDetails, setNewUserDetails] = useState({
    username: "",
    password: "",
    password2: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const navigate = useNavigate();

  const [, setAuthDetails] = useAuthContext();

  const mutation = useMutation((newUser) => {
    return fetch("https://ftm.pythonanywhere.com/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    }).then((response) => response.json());
  });

  const handleFormChange = (event) => {
    mutation.reset();
    setNewUserDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFormSubmit = () => {
    mutation.mutate(
      { ...newUserDetails },
      {
        onSuccess: (data) => {
          const formattedData = {
            id: data.id,
            user: data.username,
            ...data.tokens,
          };
          setAuthDetails(formattedData);
          navigate("/user-list");
        },
      }
    );
  };

  return (
    <div className={styles["register-container"]}>
      <div>
        <Input
          placeholder="First Name"
          className={styles["mantine-Input-wrapper"]}
          name="first_name"
          onChange={handleFormChange}
        />
        <Input
          placeholder="Last Name"
          className={styles["mantine-Input-wrapper"]}
          name="last_name"
          onChange={handleFormChange}
        />
        <Input
          placeholder="Username"
          className={styles["mantine-Input-wrapper"]}
          name="username"
          onChange={handleFormChange}
        />
        <Input
          placeholder="Email"
          className={styles["mantine-Input-wrapper"]}
          name="email"
          onChange={handleFormChange}
        />
        <PasswordInput
          withAsterisk
          placeholder="Password"
          className={styles["mantine-Input-wrapper"]}
          name="password"
          onChange={handleFormChange}
        />
        <PasswordInput
          placeholder="Confirm Password"
          withAsterisk
          className={styles["mantine-Input-wrapper"]}
          name="password2"
          onChange={handleFormChange}
        />
        <Button onClick={handleFormSubmit}>
          {mutation.isLoading ? "Registering..." : "Register"}
        </Button>
      </div>
      {mutation.isError ? (
        <p>Form submit error: {mutation.error.message}</p>
      ) : null}
    </div>
  );
};

export default Register;
