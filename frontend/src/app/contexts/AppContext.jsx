import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
const translations = {
  en: {
    // Landing Page
    "landing.tagline": "Sell crops or find services easily",
    "landing.farmer": "I am a Farmer",
    "landing.buyer": "I am a Buyer",
    "landing.subtitle": "Connect, Trade, Grow Together",
    // Auth
    "auth.signup": "Sign Up",
    "auth.login": "Login",
    "auth.logout": "Logout",
    "auth.name": "Name",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.selectRole": "Select Your Role",
    "auth.signingAs": "Signing up as",
    "auth.loginAs": "Login as",
    "auth.createAccount": "Create Account",
    "auth.alreadyAccount": "Already have an account?",
    "auth.noAccount": "Don't have an account?",
    // Roles
    "role.farmer": "Farmer",
    "role.buyer": "Buyer",
    "role.farmer.desc": "Sell crops / post needs",
    "role.buyer.desc": "Buy or offer services",
    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.createPost": "Create Post",
    "dashboard.myPosts": "My Posts",
    "dashboard.viewBids": "View Bids",
    "dashboard.browsePosts": "Browse Posts",
    "dashboard.myBids": "My Bids",
    // Posts
    "post.title": "Title",
    "post.description": "Description",
    "post.price": "Price",
    "post.submit": "Submit Post",
    "post.viewDetails": "View Details",
    "post.noPosts": "No posts yet",
    "post.createFirst": "Create your first post",
    // Bids
    "bid.place": "Place Bid",
    "bid.amount": "Enter amount \u20B9",
    "bid.noBids": "No bids yet",
    "bid.chat": "Chat",
    "bid.bidder": "Bidder",
    "bid.bidAmount": "Bid Amount",
    // Chat
    "chat.type": "Type a message...",
    "chat.send": "Send",
    // Common
    "common.back": "Back",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit"
  },
  hi: {
    // Landing Page
    "landing.tagline": "\u092B\u0938\u0932\u0947\u0902 \u092C\u0947\u091A\u0947\u0902 \u092F\u093E \u0938\u0947\u0935\u093E\u090F\u0902 \u0906\u0938\u093E\u0928\u0940 \u0938\u0947 \u0916\u094B\u091C\u0947\u0902",
    "landing.farmer": "\u092E\u0948\u0902 \u0915\u093F\u0938\u093E\u0928 \u0939\u0942\u0901",
    "landing.buyer": "\u092E\u0948\u0902 \u0916\u0930\u0940\u0926\u093E\u0930 \u0939\u0942\u0901",
    "landing.subtitle": "\u091C\u0941\u0921\u093C\u0947\u0902, \u0935\u094D\u092F\u093E\u092A\u093E\u0930 \u0915\u0930\u0947\u0902, \u0938\u093E\u0925 \u092C\u0922\u093C\u0947\u0902",
    // Auth
    "auth.signup": "\u0938\u093E\u0907\u0928 \u0905\u092A \u0915\u0930\u0947\u0902",
    "auth.login": "\u0932\u0949\u0917\u093F\u0928",
    "auth.logout": "\u0932\u0949\u0917\u0906\u0909\u091F",
    "auth.name": "\u0928\u093E\u092E",
    "auth.email": "\u0908\u092E\u0947\u0932",
    "auth.password": "\u092A\u093E\u0938\u0935\u0930\u094D\u0921",
    "auth.selectRole": "\u0905\u092A\u0928\u0940 \u092D\u0942\u092E\u093F\u0915\u093E \u091A\u0941\u0928\u0947\u0902",
    "auth.signingAs": "\u0938\u093E\u0907\u0928 \u0905\u092A \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902",
    "auth.loginAs": "\u0932\u0949\u0917\u093F\u0928 \u0915\u0930\u0947\u0902",
    "auth.createAccount": "\u0916\u093E\u0924\u093E \u092C\u0928\u093E\u090F\u0902",
    "auth.alreadyAccount": "\u092A\u0939\u0932\u0947 \u0938\u0947 \u0916\u093E\u0924\u093E \u0939\u0948?",
    "auth.noAccount": "\u0916\u093E\u0924\u093E \u0928\u0939\u0940\u0902 \u0939\u0948?",
    // Roles
    "role.farmer": "\u0915\u093F\u0938\u093E\u0928",
    "role.buyer": "\u0916\u0930\u0940\u0926\u093E\u0930",
    "role.farmer.desc": "\u092B\u0938\u0932\u0947\u0902 \u092C\u0947\u091A\u0947\u0902 / \u091C\u0930\u0942\u0930\u0924\u0947\u0902 \u092A\u094B\u0938\u094D\u091F \u0915\u0930\u0947\u0902",
    "role.buyer.desc": "\u0916\u0930\u0940\u0926\u0947\u0902 \u092F\u093E \u0938\u0947\u0935\u093E\u090F\u0902 \u0926\u0947\u0902",
    // Dashboard
    "dashboard.welcome": "\u0938\u094D\u0935\u093E\u0917\u0924",
    "dashboard.createPost": "\u092A\u094B\u0938\u094D\u091F \u092C\u0928\u093E\u090F\u0902",
    "dashboard.myPosts": "\u092E\u0947\u0930\u0940 \u092A\u094B\u0938\u094D\u091F",
    "dashboard.viewBids": "\u092C\u094B\u0932\u093F\u092F\u093E\u0902 \u0926\u0947\u0916\u0947\u0902",
    "dashboard.browsePosts": "\u092A\u094B\u0938\u094D\u091F \u0926\u0947\u0916\u0947\u0902",
    "dashboard.myBids": "\u092E\u0947\u0930\u0940 \u092C\u094B\u0932\u093F\u092F\u093E\u0902",
    // Posts
    "post.title": "\u0936\u0940\u0930\u094D\u0937\u0915",
    "post.description": "\u0935\u093F\u0935\u0930\u0923",
    "post.price": "\u0915\u0940\u092E\u0924",
    "post.submit": "\u092A\u094B\u0938\u094D\u091F \u0938\u092C\u092E\u093F\u091F \u0915\u0930\u0947\u0902",
    "post.viewDetails": "\u0935\u093F\u0935\u0930\u0923 \u0926\u0947\u0916\u0947\u0902",
    "post.noPosts": "\u0905\u092D\u0940 \u0924\u0915 \u0915\u094B\u0908 \u092A\u094B\u0938\u094D\u091F \u0928\u0939\u0940\u0902",
    "post.createFirst": "\u0905\u092A\u0928\u0940 \u092A\u0939\u0932\u0940 \u092A\u094B\u0938\u094D\u091F \u092C\u0928\u093E\u090F\u0902",
    // Bids
    "bid.place": "\u092C\u094B\u0932\u0940 \u0932\u0917\u093E\u090F\u0902",
    "bid.amount": "\u0930\u093E\u0936\u093F \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 \u20B9",
    "bid.noBids": "\u0905\u092D\u0940 \u0924\u0915 \u0915\u094B\u0908 \u092C\u094B\u0932\u0940 \u0928\u0939\u0940\u0902",
    "bid.chat": "\u091A\u0948\u091F",
    "bid.bidder": "\u092C\u094B\u0932\u0940 \u0932\u0917\u093E\u0928\u0947 \u0935\u093E\u0932\u093E",
    "bid.bidAmount": "\u092C\u094B\u0932\u0940 \u0930\u093E\u0936\u093F",
    // Chat
    "chat.type": "\u0938\u0902\u0926\u0947\u0936 \u0932\u093F\u0916\u0947\u0902...",
    "chat.send": "\u092D\u0947\u091C\u0947\u0902",
    // Common
    "common.back": "\u0935\u093E\u092A\u0938",
    "common.cancel": "\u0930\u0926\u094D\u0926 \u0915\u0930\u0947\u0902",
    "common.save": "\u0938\u0939\u0947\u091C\u0947\u0902",
    "common.delete": "\u0939\u091F\u093E\u090F\u0902",
    "common.edit": "\u0938\u0902\u092A\u093E\u0926\u093F\u0924 \u0915\u0930\u0947\u0902"
  }
};
const AppContext = createContext(void 0);
function AppProvider({ children }) {
  const [language, setLanguageState] = useState("en");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const savedLang = localStorage.getItem("vanik_language");
    const savedUser = localStorage.getItem("vanik_user");
    if (savedLang && (savedLang === "en" || savedLang === "hi")) {
      setLanguageState(savedLang);
    }
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user", e);
      }
    }
  }, []);
  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("vanik_language", lang);
  };
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("vanik_user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("vanik_user");
  };
  const t = (key) => {
    return translations[language][key] || key;
  };
  return /* @__PURE__ */ jsx(AppContext.Provider, { value: { language, setLanguage, user, login, logout, t }, children });
}
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
export {
  AppProvider,
  useApp
};
