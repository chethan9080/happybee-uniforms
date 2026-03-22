import React from "react";
import { loginPageData } from "@/data/mockData";
import { useLogin } from "@/hooks/useLogin";
import { Bug, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function HappyBLogin() {
  const { handleLogin, isLoading } = useLogin();

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 honeycomb-pattern honeycomb-mask pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tertiary-container rounded-full opacity-10 blur-3xl"></div>
        
        <div className="w-full max-w-md z-10">
          {/* Brand Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center justify-center gap-1">
              <span className="font-headline font-black text-5xl tracking-tighter text-on-surface">
                {loginPageData.brand.letters.h}
              </span>
              <span className="font-headline font-black text-5xl tracking-tighter text-on-surface">
                {loginPageData.brand.letters.a}
              </span>
              
              {/* Googly eye 'p's */}
              <div className="relative w-10 h-12 flex items-center justify-center">
                <span className="font-headline font-black text-5xl tracking-tighter text-on-surface absolute inset-0">
                  {loginPageData.brand.letters.p1}
                </span>
                <div className="absolute top-[14px] left-[10px] w-3 h-3 bg-white rounded-full border border-on-surface">
                  <div className="w-1.5 h-1.5 bg-on-surface rounded-full m-0.5"></div>
                </div>
              </div>
              <div className="relative w-10 h-12 flex items-center justify-center">
                <span className="font-headline font-black text-5xl tracking-tighter text-on-surface absolute inset-0">
                  {loginPageData.brand.letters.p2}
                </span>
                <div className="absolute top-[14px] left-[10px] w-3 h-3 bg-white rounded-full border border-on-surface">
                  <div className="w-1.5 h-1.5 bg-on-surface rounded-full m-0.5"></div>
                </div>
              </div>
              
              <span className="font-headline font-black text-5xl tracking-tighter text-on-surface">
                {loginPageData.brand.letters.y}
              </span>
              
              {/* Cartoon Bee 'B' */}
              <div className="relative ml-1">
                <span className="font-headline font-black text-6xl text-primary leading-none">
                  {loginPageData.brand.letters.b}
                </span>
                <div className="absolute -top-4 -right-2 transform rotate-12">
                  <Bug className="text-primary-container w-8 h-8 fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_32px_64px_-12px_rgba(27,28,21,0.06)] border border-outline-variant/10">
            <div className="mb-8">
              <h1 className="font-headline font-bold text-2xl text-on-surface mb-2">
                {loginPageData.content.title}
              </h1>
              <p className="text-on-surface-variant font-medium">
                {loginPageData.content.subtitle}
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="font-headline font-semibold text-sm ml-4 text-on-surface"
                >
                  {loginPageData.content.emailLabel}
                </label>
                <input 
                  id="email" 
                  type="email" 
                  required
                  placeholder={loginPageData.content.emailPlaceholder}
                  className="w-full h-14 px-6 rounded-full bg-surface-container-low border-none ring-1 ring-inset ring-outline-variant/30 focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant/50 transition-all outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label 
                    htmlFor="password" 
                    className="font-headline font-semibold text-sm text-on-surface"
                  >
                    {loginPageData.content.passwordLabel}
                  </label>
                </div>
                <input 
                  id="password" 
                  type="password" 
                  required
                  placeholder={loginPageData.content.passwordPlaceholder}
                  className="w-full h-14 px-6 rounded-full bg-surface-container-low border-none ring-1 ring-inset ring-outline-variant/30 focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant/50 transition-all outline-none"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-primary-container text-on-primary-container font-headline font-bold text-lg rounded-full shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? "Loading..." : loginPageData.content.loginButtonText}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-surface-container space-y-4 text-center">
              <a href="#" className="block text-sm font-semibold text-secondary hover:text-on-surface transition-colors">
                {loginPageData.content.forgotPasswordText}
              </a>
              <p className="text-sm text-on-surface-variant">
                {loginPageData.content.newToHiveText}{" "}
                <a href="#" className="text-primary font-bold hover:underline ml-1">
                  {loginPageData.content.signUpText}
                </a>
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-on-surface" />
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
                {loginPageData.badges[0].text}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-on-surface" />
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
                {loginPageData.badges[1].text}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low py-8 px-6 text-center">
        <p className="font-body text-sm text-on-surface-variant mb-4">
          {loginPageData.footer.copyright}
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-secondary uppercase tracking-wider">
          {loginPageData.footer.links.map((link) => (
            <a key={link} href="#" className="hover:text-primary transition-colors">
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
