import { createRouter, createWebHistory } from "vue-router";
import Authentication from "./views/auth.vue";
import Landing from "./views/landing.vue";
import Home from "./views/HomeSection.vue";
import Faq from "./views/FAQsSection.vue";
import Setting from "./views/SettingsSection.vue";
import Profile from "./views/ProfileSection.vue";
import Administrator from "./views/Admin.vue";
import { supabase } from "./supabaseClient";
import ForgotPass from "./views/ForgotPass.vue";
import UpdatePass from "./views/UpdatePass.vue";

const routes = [
  { path: "/", name: "Landing", component: Landing },
  { path: "/auth", name: "Auth", component: Authentication },
  { path: "/homesec", name: "Home", component: Home, meta: { requiresAuth: true } },
  { path: "/forgotpass", name: "ForgotPass", component: ForgotPass },
  { path: "/updatepass", name: "UpdatePass", component: UpdatePass, meta: { requiresAuth: true } },
  { path: "/faqssec", name: "Faq", component: Faq, meta: { requiresAuth: true } },
  { path: "/settingsec", name: "Setting", component: Setting, meta: { requiresAuth: true } },
  { path: "/profilesec", name: "Profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/adminsection", name: "Admin", component: Administrator, meta: { requiresAuth: true } }, 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("access_token");
  const isAuthenticated = !!token;

  console.log("Navigating to:", to.path);
  console.log("From route:", from.path);
  console.log("Is Authenticated:", isAuthenticated);
  console.log("Requires Auth:", to.meta.requiresAuth);

  // Bypass auth for updatepass, but validate session tokens if available
  if (to.path === "/updatepass") {
    const url = new URL(window.location.href);
    const accessToken = url.hash.match(/access_token=([^&]*)/);
    const refreshToken = url.hash.match(/refresh_token=([^&]*)/);
  
    if (accessToken && refreshToken) {
      console.log("Setting session from recovery tokens...");
      const { error } = await supabase.auth.setSession({
        access_token: accessToken[1],
        refresh_token: refreshToken[1],
      });
  
      if (error) {
        console.error("Failed to set session:", error.message);
        return next("/auth");
      }
  
      console.log("Session set successfully.");
      window.history.replaceState({}, document.title, "/updatepass");
    }
  
    return next();
  }

  // Check if the user is authenticated for protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log("Not authenticated. Redirecting to /auth.");
    return next("/auth");
  }

  // For authenticated users, verify their session
  if (isAuthenticated) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION')) {
          console.warn("Network error detected. Allowing navigation with cached token.");
          return next();
        }
        console.error("Invalid session detected. Redirecting to /auth.");
        localStorage.removeItem("access_token");
        return next("/auth");
      }

      if (!user) {
        console.error("No user found. Redirecting to /auth.");
        localStorage.removeItem("access_token");
        return next("/auth");
      }

      console.log("User session valid:", user);

      const { data: userInfo, error: userInfoError } = await supabase
        .from("users_info")
        .select("isAdmin")
        .eq("auth_users", user.id)
        .maybeSingle();

      if (userInfoError) {
        if (userInfoError.message?.includes('fetch') || userInfoError.message?.includes('Failed to fetch')) {
          console.warn("Network error fetching user info. Allowing navigation.");
          return next();
        }
        console.error("Failed to fetch user info:", userInfoError.message);
        return next("/auth");
      }

      console.log("User info:", userInfo);

      if (userInfo?.isAdmin && to.path !== "/adminsection") {
        console.log("Redirecting admin user to /adminsection.");
        return next("/adminsection");
      }

      console.log("Authenticated user allowed to navigate.");
    } catch (error) {
      console.error("Error during authentication check:", error.message);
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION')) {
        console.warn("Caught network error. Allowing navigation with cached session.");
        return next();
      }
      localStorage.removeItem("access_token");
      return next("/auth");
    }
  }

  console.log("Navigation allowed to:", to.path);
  next();
});

export default router;
