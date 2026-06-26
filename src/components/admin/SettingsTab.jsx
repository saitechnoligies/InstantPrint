import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Shield, Bell, Sliders, Save, CheckCircle2, Loader2, CreditCard, Clock, Globe } from "lucide-react";

export default function SettingsTab() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- MOCK SETTINGS STATE ---
  const [settings, setSettings] = useState({
    // General
    appName: "PrintNow Kiosks",
    supportEmail: "support@printnow.com",
    timezone: "Asia/Kolkata",
    currency: "INR (₹)",
    
    // Pricing & Limits
    basePageCost: "2.00",
    colorMultiplier: "3.5",
    maxFileSize: "50",
    
    // Security
    requireAdmin2FA: true,
    sessionTimeout: "30",
    allowGuestUploads: false,
    
    // Notifications
    emailOnFailedJob: true,
    emailOnLowInk: true,
    dailyReport: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // --- REUSABLE COMPONENTS ---
  const CategoryButton = ({ id, label, icon: Icon }) => {
    const isActive = activeCategory === id;
    return (
      <button
        type="button"
        onClick={() => setActiveCategory(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive 
            ? "bg-[#c9a66b]/10 text-[#c9a66b] font-medium" 
            : "text-[#a3a098] hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? "text-[#c9a66b]" : "text-[#a3a098]"}`} />
        {label}
      </button>
    );
  };

  const Toggle = ({ label, description, isChecked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
      <div className="pr-4">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-[#a3a098] mt-1 leading-relaxed">{description}</div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ${
          isChecked ? "bg-[#c9a66b]" : "bg-white/10"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isChecked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const InputGroup = ({ label, type = "text", icon: Icon, value, onChange, placeholder, suffix }) => (
    <div>
      <label className="block text-xs font-medium text-[#a3a098] mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a098]" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-[#0C0B0A]/50 border border-white/10 rounded-xl py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50 transition-colors ${
            Icon ? "pl-10" : "pl-4"
          } ${suffix ? "pr-12" : "pr-4"}`}
        />
        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#a3a098]">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-serif text-white">System Settings</h2>
          <p className="text-sm text-[#a3a098]">Configure global platform parameters and security rules.</p>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium"
            >
              <CheckCircle2 className="w-4 h-4" />
              Settings Saved
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* --- LEFT SIDEBAR NAV --- */}
        <div className="md:col-span-3 lg:col-span-3 bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-2 shadow-lg">
          <CategoryButton id="general" label="General" icon={Settings} />
          <CategoryButton id="pricing" label="Pricing & Limits" icon={CreditCard} />
          <CategoryButton id="security" label="Security" icon={Shield} />
          <CategoryButton id="notifications" label="Notifications" icon={Bell} />
        </div>

        {/* --- RIGHT CONTENT AREA --- */}
        <div className="md:col-span-9 lg:col-span-9 bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg overflow-hidden min-h-[400px]">
          <form onSubmit={handleSave} className="flex flex-col h-full">
            
            <div className="p-6 sm:p-8 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  
                  {/* === GENERAL TAB === */}
                  {activeCategory === "general" && (
                    <>
                      <div className="border-b border-white/5 pb-4 mb-6">
                        <h3 className="text-lg font-serif text-white">General Preferences</h3>
                        <p className="text-xs text-[#a3a098]">Basic information about your platform.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputGroup 
                          label="Platform Name" 
                          icon={Globe}
                          value={settings.appName} 
                          onChange={(e) => updateSetting("appName", e.target.value)} 
                        />
                        <InputGroup 
                          label="Support Email" 
                          type="email" 
                          icon={Bell}
                          value={settings.supportEmail} 
                          onChange={(e) => updateSetting("supportEmail", e.target.value)} 
                        />
                        <div>
                          <label className="block text-xs font-medium text-[#a3a098] mb-1.5">Default Currency</label>
                          <select 
                            value={settings.currency}
                            onChange={(e) => updateSetting("currency", e.target.value)}
                            className="w-full bg-[#0C0B0A]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50"
                          >
                            <option value="INR (₹)">INR (₹)</option>
                            <option value="USD ($)">USD ($)</option>
                            <option value="EUR (€)">EUR (€)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#a3a098] mb-1.5">System Timezone</label>
                          <select 
                            value={settings.timezone}
                            onChange={(e) => updateSetting("timezone", e.target.value)}
                            className="w-full bg-[#0C0B0A]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50"
                          >
                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* === PRICING & LIMITS TAB === */}
                  {activeCategory === "pricing" && (
                    <>
                      <div className="border-b border-white/5 pb-4 mb-6">
                        <h3 className="text-lg font-serif text-white">Pricing & Limits</h3>
                        <p className="text-xs text-[#a3a098]">Set base costs and restrict upload sizes.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputGroup 
                          label="Base Page Cost (B&W)" 
                          type="number"
                          value={settings.basePageCost} 
                          onChange={(e) => updateSetting("basePageCost", e.target.value)} 
                          suffix="₹"
                        />
                        <InputGroup 
                          label="Color Cost Multiplier" 
                          type="number"
                          value={settings.colorMultiplier} 
                          onChange={(e) => updateSetting("colorMultiplier", e.target.value)} 
                          suffix="x"
                        />
                        <InputGroup 
                          label="Max Upload File Size" 
                          type="number"
                          value={settings.maxFileSize} 
                          onChange={(e) => updateSetting("maxFileSize", e.target.value)} 
                          suffix="MB"
                        />
                      </div>
                    </>
                  )}

                  {/* === SECURITY TAB === */}
                  {activeCategory === "security" && (
                    <>
                      <div className="border-b border-white/5 pb-4 mb-6">
                        <h3 className="text-lg font-serif text-white">Security Policies</h3>
                        <p className="text-xs text-[#a3a098]">Protect your admin dashboard and kiosk network.</p>
                      </div>
                      <div className="space-y-4">
                        <Toggle 
                          label="Require 2FA for Administrators" 
                          description="Force all admin accounts to use two-factor authentication via Clerk."
                          isChecked={settings.requireAdmin2FA}
                          onChange={() => updateSetting("requireAdmin2FA", !settings.requireAdmin2FA)}
                        />
                        <Toggle 
                          label="Allow Guest Uploads" 
                          description="Allow users to upload documents and print without creating an account."
                          isChecked={settings.allowGuestUploads}
                          onChange={() => updateSetting("allowGuestUploads", !settings.allowGuestUploads)}
                        />
                        <div className="pt-2">
                          <InputGroup 
                            label="Admin Session Timeout" 
                            type="number"
                            icon={Clock}
                            value={settings.sessionTimeout} 
                            onChange={(e) => updateSetting("sessionTimeout", e.target.value)} 
                            suffix="Mins"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* === NOTIFICATIONS TAB === */}
                  {activeCategory === "notifications" && (
                    <>
                      <div className="border-b border-white/5 pb-4 mb-6">
                        <h3 className="text-lg font-serif text-white">System Alerts</h3>
                        <p className="text-xs text-[#a3a098]">Choose when the system emails administrators.</p>
                      </div>
                      <div className="space-y-4">
                        <Toggle 
                          label="Low Consumable Warnings" 
                          description="Send an email when any kiosk drops below 20% paper or ink."
                          isChecked={settings.emailOnLowInk}
                          onChange={() => updateSetting("emailOnLowInk", !settings.emailOnLowInk)}
                        />
                        <Toggle 
                          label="Hardware Failure Alerts" 
                          description="Notify admins immediately if a print job fails due to hardware error."
                          isChecked={settings.emailOnFailedJob}
                          onChange={() => updateSetting("emailOnFailedJob", !settings.emailOnFailedJob)}
                        />
                        <Toggle 
                          label="Daily Revenue Report" 
                          description="Send a summary CSV of all transactions at midnight."
                          isChecked={settings.dailyReport}
                          onChange={() => updateSetting("dailyReport", !settings.dailyReport)}
                        />
                      </div>
                    </>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* --- FORM FOOTER --- */}
            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-[#c9a66b]/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}