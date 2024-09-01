import { toast } from "sonner";

const validateSignUp = (form) => {
    const { email, password, confirmPassword } = form;
    if (!email.length) {
        toast.error("Email is required");
        return false;
    } else if (!password.length) {
        toast.error("Password is required");
        return false;
    } else if (!confirmPassword.length) {
        toast.error("Confirm Password is required");
        return false;
    } else if (password !== confirmPassword) {
        toast.error("Password and confirm password should be same");
        return false;
    }
    return true;
}
const validateLogin = (form) => {
    const { email, password } = form;
    if (!email.length) {
        toast.error("Email is required");
        return false;
    } else if (!password.length) {
        toast.error("Password is required");
        return false;
    }
    return true;
}
const validateProfile = (form) => {
    const { firstName, lastName, selectedColor } = form;
    if (!firstName.length) {
        toast.error("First Name is required");
        return false;
    } else if (!lastName.length) {
        toast.error("Last Name is required");
        return false;
    }
    return true;
}
export const Helper = {
    validateSignUp,
    validateLogin,
    validateProfile
}