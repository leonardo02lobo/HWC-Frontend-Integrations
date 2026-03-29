const registerForm = document.getElementById("register-form") as HTMLFormElement | null;
const loginForm = document.getElementById("login-form") as HTMLFormElement | null;
const toggleAuthMode = document.getElementById("toggle-auth-mode") as HTMLAnchorElement | null;

interface RegisterFormData {
    username: string;
    name: string;
    mail: string;
    programingLanguage: string;
    profileGithub: string;
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

if (registerForm && loginForm && toggleAuthMode) {
    let isLoginMode = false;

    const setAuthMode = (loginMode: boolean) => {
        isLoginMode = loginMode;
        registerForm.classList.toggle("auth-panel--active", !loginMode);
        loginForm.classList.toggle("auth-panel--active", loginMode);

        toggleAuthMode.textContent = loginMode
            ? "¿Aún no tienes cuenta? Regístrate"
            : "¿Ya tienes usuario y contraseña? Inicia sesión";
    };

    toggleAuthMode.addEventListener("click", (event) => {
        event.preventDefault();
        setAuthMode(!isLoginMode);
    });

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const data: RegisterFormData = {
            username: formData.get("username") as string,
            name: formData.get("name") as string,
            mail: formData.get("email") as string,
            programingLanguage: formData.get("language") as string,
            profileGithub: formData.get("github") as string,
        };

        console.log(data);
        dispatchAuthModal({ type: "register-success", email: data.mail });
        registerForm.reset();
        setAuthMode(true);
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const data: LoginFormData = {
            email: (formData.get("login-email") as string) ?? "",
            password: (formData.get("login-password") as string) ?? "",
        };

        const credentialsAreValid =
            data.email.trim().toLowerCase() === "participant@hwc.com" &&
            data.password === "HWC2026";

        if (!credentialsAreValid) {
            dispatchAuthModal({ type: "invalid-credentials" });
            return;
        }
        document.cookie = JSON.stringify({
            email: data.email,
            password: data.password,
            user: "participant",
        })
        window.location.href = "/profile"
        loginForm.reset();
    });
}