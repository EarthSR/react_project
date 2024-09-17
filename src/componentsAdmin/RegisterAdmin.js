import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Link
} from "@mui/material";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastname] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!username || !password || !firstName || !lastName) {
      setError("All fields are required. Please fill out every field.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api//register`,
        {
          username,
          password,
          firstName,
          lastName,
        }
      );
      const result = response.data;
      console.log(result);
      const message = result.message;
      const status = result.status;

      if (status === true || message === "ลงทะเบียนสำเร็จแล้ว") {
        window.location.href = "/login";
      } else {
        setError(message); 
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const message = error.response.data.message;
        const status = error.response.data.status;
        if (status === false) {
          setError(message); 
        }
      } else {
        console.error("Register error:", error);
        setError("An error occurred during registration. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register Admin
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastname(e.target.value)}
            required
          />

          <Link
            component="button"
            variant="body2"
            onClick={() => {
              window.location.href = "/Login";
            }}
          >
            IF you have already account, please click here
          </Link>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
}

export default Register;
