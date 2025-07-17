'use client';
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("ar");

  const translations = {
    en: {
      map: "Search by map",
      list: "Search by list",
      signIn: "Sign In",
      signOut: "Sign Out",
      addProperty: "Add Property",
      language: "العربية",
      menu: "Menu",
      mobile: "Mobile",
      password: "Password",
      invalidCredentials: "Invalid mobile or password",
      welcome: "Welcome",
      forgotPassword: "Forgot Password?",
      dontHaveAccount: "Don't have an account?",
      signUp: "Sign Up",
      firstName: "First Name",
      lastName: "Last Name",
      confirmPassword: "Confirm Password",
      passwordsDontMatch: "Passwords don't match",
      invalidMobile: "Invalid Syrian mobile number format",
      signupError: "Signup failed",
      networkError: "Network error",
      loading: "Processing...",
      alreadyHaveAccount: "Already have an account?",
      signinAfterSignupFailed: 'Signup successful! Please sign in',
      dashboard: "Dashboard",
      welcomeBack: "Welcome Back",
      mapView: "Map View",
      satelliteView: "Satellite View",
      governorates: "Syrian Governorates",
      loadingMap: "Loading map..."

    },
    ar: {
      map: "البحث بالخريطة",
      list: "البحث بالقائمة",
      signIn: "تسجيل الدخول",
      signOut: "تسجيل الخروج",
      addProperty: "إضافة عقار",
      language: "English",
      menu: "القائمة",
      mobile: "رقم الجوال",
      password: "كلمة المرور",
      invalidCredentials: "رقم الجوال أو كلمة المرور غير صحيحة",
      welcome: "مرحباً",
      forgotPassword: "نسيت كلمة المرور؟",
      dontHaveAccount: "ليس لديك حساب؟",
      signUp: "تسجيل",
      firstName: "الاسم الأول",
      lastName: "الاسم الأخير",
      confirmPassword: "تأكيد كلمة المرور",
      passwordsDontMatch: "كلمات المرور غير متطابقة",
      invalidMobile: "صيغة رقم الجوال السوري غير صالحة",
      signupError: "فشل إنشاء الحساب",
      networkError: "خطأ في الشبكة",
      loading: "جاري المعالجة...",
      alreadyHaveAccount: "هل لديك حساب بالفعل؟",
      signinAfterSignupFailed: 'تم التسجيل بنجاح! يرجى تسجيل الدخول',
      dashboard: "لوحة التحكم",
      welcomeBack: "أهلا بك يا ",
      mapView: "عرض الخريطة",
      satelliteView: "عرض الأقمار الصناعية",
      governorates: "المحافظات السورية",
      loadingMap: "جاري تحميل الخريطة..."
    }
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === "en" ? "ar" : "en");
  };

  return (
    <LanguageContext.Provider value={{ language, translations, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};