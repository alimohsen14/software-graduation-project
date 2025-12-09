
import React from "react";

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal = ({ isOpen, onClose }: LanguageModalProps) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white rounded-xl shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <FiX size={24} />
            </button>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {t('navbar.selectLanguage')}
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    i18n.language === 'en'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span className="font-medium">English</span>
                  {i18n.language === 'en' && (
                    <span className="text-green-500">✓</span>
                  )}
                </button>

                <button
                  onClick={() => changeLanguage('ar')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    i18n.language === 'ar'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span className="font-medium">العربية</span>
                  {i18n.language === 'ar' && (
                    <span className="text-green-500">✓</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LanguageModal;