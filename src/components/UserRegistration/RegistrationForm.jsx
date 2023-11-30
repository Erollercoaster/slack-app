import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/API";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import backgroundImage from "../../assets/bg.jpg";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import { toast } from "react-toastify";

const defaultTheme = createTheme();

function RegistrationForm() {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    document.body.style.background = `url(${backgroundImage}) no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";
    return () => {
      document.body.style.background = "";
      document.body.style.backgroundSize = "";
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/auth", registrationData);

      console.log("Registration successful", registrationData);

      setRegistrationData({
        email: "",
        password: "",
        password_confirmation: "",
      });

      navigate("/");
      toast.success("Registered Successfully!");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        console.error("Validation errors:", validationErrors);

        // Use toast to display validation errors
        const validationErrorMessage = `Validation errors:\n${validationErrors.full_messages.join(
          "\n"
        )}`;
        toast.error(validationErrorMessage);
      } else {
        console.error(
          "Registration failed:",
          error.response ? error.response.data : error
        );
        const errorMessage =
          error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : "Registration Failed";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#263238",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#37474f" }}></Avatar>
          <Typography component="h1" variant="h5" style={{ color: "white" }}>
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleRegistrationSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={registrationData.email}
              onChange={handleInputChange}
              sx={{
                "& label": {
                  color: "white", // Label color by default
                },
                "& .MuiInputBase-input": {
                  color: "white", // Text color
                  backgroundColor: "transparent",
                },
                "& label.Mui-focused": {
                  color: "#0cce6b", // Label color when focused
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "white", // Underline color before focus
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#0cce6b", // Underline color on focus
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#0cce6b", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0cce6b", // Border color when focused
                  },
                },
              }}
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
              value={registrationData.password}
              onChange={handleInputChange}
              sx={{
                "& label": {
                  color: "white", // Label color by default
                },
                "& .MuiInputBase-input": {
                  color: "white", // Text color
                },
                "& label.Mui-focused": {
                  color: "#0cce6b",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#0cce6b",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#0cce6b", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0cce6b", // Border color when focused
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password_confirmation"
              label="Confirm Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={registrationData.password_confirmation}
              onChange={handleInputChange}
              sx={{
                "& label": {
                  color: "white", // Label color by default
                },
                "& .MuiInputBase-input": {
                  color: "white", // Text color
                },
                "& label.Mui-focused": {
                  color: "#0cce6b",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#0cce6b",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#0cce6b", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0cce6b", // Border color when focused
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#0cce6b",
                "&:hover": {
                  backgroundColor: "lightgreen",
                },
              }}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  to="/"
                  variant="body2"
                  component={RouterLink}
                  style={{ color: "#0cce6b" }}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export { RegistrationForm };
