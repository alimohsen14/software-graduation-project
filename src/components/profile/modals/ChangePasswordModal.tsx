import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { profileService } from '../../../services/profileService';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("ChangePasswordModal [DEBUG]: Initiating Password Update Flow...");

    // 1. Validation
    if (!formData.currentPassword) {
      toast.error(t("profile.currentPasswordRequired") || "Current password is required");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error(t("profile.passwordTooShort") || "New password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t("profile.passwordMismatch"));
      console.warn("ChangePasswordModal [DEBUG]: Validation Failed - Passwords mismatch");
      return;
    }

    setIsLoading(true);
    try {
      console.log("ChangePasswordModal [DEBUG]: Sending PATCH request to /auth/profile/password...");

      // The service expects (oldPassword, newPassword)
      const message = await profileService.changePassword(
        formData.currentPassword,
        formData.newPassword
      );

      console.log("ChangePasswordModal [DEBUG]: API Success! Response message:", message);
      toast.success(t("profile.passwordUpdated") || "Password updated successfully");

      // Success Treatment: Reset form and Close modal
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      onClose();
    } catch (error: any) {
      const status = error.response?.status;
      const errorMsg = error.response?.data?.message || t("profile.updateFailed");

      console.error(`ChangePasswordModal [DEBUG]: API Failure [Status: ${status}]:`, errorMsg);
      toast.error(errorMsg);

      // Error Treatment: Do NOT close modal, do NOT reset form
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto" dir={direction}>
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-8 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-8 sm:scale-95"
            >
              <Dialog.Panel className="w-[95%] sm:w-full max-w-lg transform overflow-hidden rounded-[2.5rem] bg-black/40 backdrop-blur-2xl border border-white/10 p-0 shadow-2xl transition-all relative">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className="px-6 md:px-10 py-6 md:py-8 bg-white/5 border-b border-white/5 flex items-center justify-between z-10 shrink-0">
                  <div className="text-right flex-1">
                    <Dialog.Title className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                      {t("profile.changePassword")}
                    </Dialog.Title>
                    <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-1">تأمين حسابك بكلمة مرور جديدة</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 relative z-10">
                  <div className="space-y-5">
                    {/* Current Password */}
                    <div className="text-right">
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2.5">
                        {t("profile.currentPassword")}
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner text-sm"
                        required
                      />
                    </div>

                    {/* New Password */}
                    <div className="text-right">
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2.5">
                        {t("profile.newPassword")}
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        minLength={6}
                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner text-sm"
                        required
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="text-right">
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2.5">
                        {t("profile.confirmPassword")}
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        minLength={6}
                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-6 py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600/30 transition-all shadow-xl active:scale-[0.98] disabled:opacity-30 text-xs flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                          {t("profile.updating")}
                        </>
                      ) : (
                        t("profile.updatePassword")
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="flex-1 px-6 py-4 bg-white/5 text-white/30 border border-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all text-xs active:scale-[0.98] disabled:opacity-30"
                    >
                      {t("profile.cancel")}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
