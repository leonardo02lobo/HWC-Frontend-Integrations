import { loginUser, registerUser, saveAuthSession } from "./services/auth.service";

const registerPanel = document.getElementById("register-form") as HTMLDivElement | null;
const loginPanel = document.getElementById("login-form") as HTMLDivElement | null;
const registerForm = registerPanel?.querySelector("form") as HTMLFormElement | null;
const loginForm = loginPanel?.querySelector("form") as HTMLFormElement | null;
const toggleAuthMode = document.getElementById("toggle-auth-mode") as HTMLAnchorElement | null;
const registerButton = document.getElementById("register-btn") as HTMLButtonElement | null;
const loginButton = loginForm?.querySelector("button[type='submit']") as HTMLButtonElement | null;

interface RegisterFormData {
    name: string;
    email: string;
    programming_language: string;
    github_profile: string;
}

interface LoginFormData {
    email: string;
    password: string;
}

type AuthModalDetail = {
    type: "invalid-credentials" | "register-success";
    email?: string;
};

const dispatchAuthModal = (detail: AuthModalDetail) => {
    window.dispatchEvent(new CustomEvent<AuthModalDetail>("auth:modal", { detail }));
};

if (registerPanel && loginPanel && registerForm && loginForm && toggleAuthMode) {
    let isLoginMode = false;

    const setAuthMode = (loginMode: boolean) => {
        isLoginMode = loginMode;
        registerPanel.classList.toggle("auth-panel--active", !loginMode);
        loginPanel.classList.toggle("auth-panel--active", loginMode);

        toggleAuthMode.textContent = loginMode
            ? "¿Aún no tienes cuenta? Regístrate"
            : "¿Ya tienes usuario y contraseña? Inicia sesión";
    };

    toggleAuthMode.addEventListener("click", (event) => {
        event.preventDefault();
        setAuthMode(!isLoginMode);
    });

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const data: RegisterFormData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            programming_language: formData.get("language") as string,
            github_profile: formData.get("github") as string,
        };

        try {
            if (registerButton) registerButton.disabled = true;
            await registerUser(data);
            dispatchAuthModal({ type: "register-success", email: data.email });
            registerForm.reset();
            setAuthMode(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo registrar el usuario";
            window.alert(message);
        } finally {
            if (registerButton) registerButton.disabled = false;
        }
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const data: LoginFormData = {
            email: (formData.get("login-email") as string) ?? "",
            password: (formData.get("login-password") as string) ?? "",
        };

        try {
            if (loginButton) loginButton.disabled = true;
            const response = await loginUser(data);

            saveAuthSession(response ?? { email: data.email });
            window.location.href = "/profile";
            loginForm.reset();
        } catch (error) {
            console.error(error);
            dispatchAuthModal({ type: "invalid-credentials" });
        } finally {
            if (loginButton) loginButton.disabled = false;
        }
    });
}
