import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link
} from "@mui/material";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      window.alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/login`,
        {
          username,
          password,
        }
      );
      const result = response.data;
      const message = result.message;
      const status = result.status;
      

      if (result && result.token) {
        localStorage.setItem("token", result.token); // Save token
        window.location.href = "/Home"; // Redirect to home
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
          setError("An unexpected error occurred."); // Generic error message for network or other issues
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            IF you don't have account, please click here
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
