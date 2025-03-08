import axios from "axios";

export async function changePasswordAction({
  newPassword,
  confirmPassword,
}: {
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const response = await axios.post("/api/password-change", {
      newPassword,
      confirmPassword,
    });
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
      };
    }

    return {
      success: false,
      error: response.data.error,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to change password",
    };
  }
}
