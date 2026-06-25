export const PASSWORD_RULE_MESSAGE =
    "Password must be at least 6 characters and include lowercase, uppercase, number, and special character.";

export const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(
        password
    );
