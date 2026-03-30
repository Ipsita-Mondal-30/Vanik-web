import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    "landing.tagline": "Sell crops or find services easily",
    "landing.farmer": "I am a Farmer",
    "landing.buyer": "I am a Buyer",
    "landing.subtitle": "Connect, Trade, Grow Together",
    "auth.signup": "Sign Up",
    "auth.login": "Login",
    "auth.logout": "Logout",
    "auth.name": "Name",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.selectRole": "Select Your Role",
    "auth.signingAs": "Signing up as",
    "auth.loginAs": "Login with your account",
    "auth.createAccount": "Create Account",
    "auth.alreadyAccount": "Already have an account?",
    "auth.noAccount": "Don't have an account?",
    "role.farmer": "Farmer",
    "role.buyer": "Buyer",
    "role.farmer.desc": "Sell crops / post needs",
    "role.buyer.desc": "Buy or offer services",
    "dashboard.welcome": "Welcome",
    "dashboard.createPost": "Create Post",
    "dashboard.myPosts": "My Posts",
    "dashboard.viewBids": "View Bids",
    "dashboard.browsePosts": "Browse Posts",
    "dashboard.myBids": "My Bids",
    "post.title": "Title",
    "post.description": "Description",
    "post.price": "Price",
    "post.submit": "Submit Post",
    "post.viewDetails": "View Details",
    "post.noPosts": "No posts yet",
    "post.createFirst": "Create your first post",
    "bid.place": "Place Bid",
    "bid.amount": "Enter amount ₹",
    "bid.noBids": "No bids yet",
    "bid.chat": "Chat",
    "bid.bidder": "Bidder",
    "bid.bidAmount": "Bid Amount",
    "chat.type": "Type a message...",
    "chat.send": "Send",
    "common.back": "Back",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.loading": "Loading...",
  },
  hi: {
    "landing.tagline":
      "फसलें बेचें या सेवाएं आसानी से खोजें",
    "landing.farmer": "मैं किसान हूँ",
    "landing.buyer": "मैं खरीदार हूँ",
    "landing.subtitle": "जुड़ें, व्यापार करें, साथ बढ़ें",
    "auth.signup": "साइन अप करें",
    "auth.login": "लॉगिन",
    "auth.logout": "लॉगआउट",
    "auth.name": "नाम",
    "auth.email": "ईमेल",
    "auth.password": "पासवर्ड",
    "auth.selectRole": "अपनी भूमिका चुनें",
    "auth.signingAs": "साइन अप कर रहे हैं",
    "auth.loginAs": "अपने खाते से लॉगिन करें",
    "auth.createAccount": "खाता बनाएं",
    "auth.alreadyAccount": "पहले से खाता है?",
    "auth.noAccount": "खाता नहीं है?",
    "role.farmer": "किसान",
    "role.buyer": "खरीदार",
    "role.farmer.desc": "फसलें बेचें / जरूरतें पोस्ट करें",
    "role.buyer.desc": "खरीदें या सेवाएं दें",
    "dashboard.welcome": "स्वागत",
    "dashboard.createPost": "पोस्ट बनाएं",
    "dashboard.myPosts": "मेरी पोस्ट",
    "dashboard.viewBids": "बोलियां देखें",
    "dashboard.browsePosts": "पोस्ट देखें",
    "dashboard.myBids": "मेरी बोलियां",
    "post.title": "शीर्षक",
    "post.description": "विवरण",
    "post.price": "कीमत",
    "post.submit": "पोस्ट सबमिट करें",
    "post.viewDetails": "विवरण देखें",
    "post.noPosts": "अभी तक कोई पोस्ट नहीं",
    "post.createFirst": "अपनी पहली पोस्ट बनाएं",
    "bid.place": "बोली लगाएं",
    "bid.amount": "राशि दर्ज करें ₹",
    "bid.noBids": "अभी तक कोई बोली नहीं",
    "bid.chat": "चैट",
    "bid.bidder": "बोली लगाने वाला",
    "bid.bidAmount": "बोली राशि",
    "chat.type": "संदेश लिखें...",
    "chat.send": "भेजें",
    "common.back": "वापस",
    "common.cancel": "रद्द करें",
    "common.save": "सहेजें",
    "common.delete": "हटाएं",
    "common.edit": "संपादित करें",
    "common.loading": "लोड हो रहा है...",
  },
};

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
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

  /** Pass token when logging in via API; omit for offline demo login */
  const login = (userData, token = null) => {
    setUser(userData);
    localStorage.setItem("vanik_user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("vanik_token", token);
    } else {
      localStorage.removeItem("vanik_token");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vanik_user");
    localStorage.removeItem("vanik_token");
    localStorage.removeItem("vanik_bids");
    localStorage.removeItem("vanik_messages");
    localStorage.removeItem("vanik_posts");
  };

  const t = (key) => translations[language][key] || key;

  return (
    <AppContext.Provider
      value={{ language, setLanguage, user, login, logout, t }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
