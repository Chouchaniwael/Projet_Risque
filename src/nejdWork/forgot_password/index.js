import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
  
    try {
      const response = await fetch("http://localhost:5000/api/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure the server knows it's JSON data
        },
        body: JSON.stringify({ email }), // Send the email in JSON format
      });
  
      // Handle response
      if (response.ok) {
        setMessage("Password reset link sent. Please check your email.");
      } else {
        const data = await response.json();
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="error"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-10}
          p={2}
          mb={1}
          textAlign="center"
        >
          
       
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Forgot your password?
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and we’ll send you a reset link
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="error" fullWidth disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </MDButton>
            </MDBox>

            {message && (
              <MDBox mt={2} textAlign="center">
                <MDTypography variant="button" color="text">
                  {message}
                </MDTypography>
              </MDBox>
            )}

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Back to{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="error"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default ForgotPassword;
