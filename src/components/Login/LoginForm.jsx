import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/API";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
import { toast } from "react-toastify";

function Copyright(props) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        website.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.background = `url(${backgroundImage}) no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";
    document.body.style.display = "flex";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";

    return () => {
      document.body.style.height = "";
      document.body.style.margin = "";
      document.body.style.background = "";
      document.body.style.backgroundSize = "";
      document.body.style.display = "";
      document.body.style.alignItems = "";
      document.body.style.justifyContent = "";
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/sign_in", loginData);

      const authHeaders = {
        "access-token": response.headers["access-token"],
        client: response.headers["client"],
        expiry: response.headers["expiry"],
        uid: response.headers["uid"],
      };
      localStorage.setItem("authHeaders", JSON.stringify(authHeaders));

      console.log("Login successful", response.data);
      localStorage.setItem("userDetails", JSON.stringify(response.data));

      navigate("/home");
      toast.success("Login Successful!");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error
      );
      toast.error("Login failed: Incorrect credentials");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          style={{
            backgroundColor: "#263238",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
          sx={{
            marginTop: "13rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#37474f" }}></Avatar>
          <Typography
            component="h1"
            variant="h5"
            style={{
              color: "white",
            }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
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
              value={loginData.email}
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
              value={loginData.password}
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
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  sx={{
                    color: "white", // Checkbox color when not checked
                    "&.Mui-checked": {
                      color: "#0cce6b", // Checkbox color when checked
                    },
                  }}
                />
              }
              label="Remember me"
              sx={{
                color: "white", // Label color
                "& .MuiTypography-root": {
                  // Target the label typography specifically
                  color: "white", // Label color
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{
                backgroundColor: "#0cce6b",
              }}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link
                  style={{ color: "#0cce6b" }}
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                >
                  {"Need an Account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
