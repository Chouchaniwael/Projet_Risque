import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";

// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Layout

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function ResetPassword() {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    setLoading(true);
    try {
      console.log(password)
      const response = await fetch(`http://localhost:5000/api/resetpassword/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successfully. Redirecting to login...");
        setTimeout(() => navigate("/authentication/sign-in"), 3000);
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
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
            Reset Your Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter and confirm your new password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="New Password"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Confirm New Password"
                variant="standard"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="error" fullWidth disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </MDButton>
            </MDBox>

            {message && (
              <MDBox mt={2} textAlign="center">
                <MDTypography variant="button" color="text">
                  {message}
                </MDTypography>
              </MDBox>
            )}
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default ResetPassword;
