// src/components/AISidebar.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiPlus,
  FiTrash2,
  FiX
} from "react-icons/fi";

type Chat = {
  id: number;
  title: string;
  createdAt: string;
};

interface Props {
  isOpen: boolean;
  toggle: () => void;
  chats: Chat[];
  onSelectChat: (id: number) => void;
  onNewChat: () => void;
  onDeleteChat: (id: number) => void;
}

export default function AISidebar({
  isOpen,
  toggle,
  chats,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: Props): React.ReactElement {
  const [chatToDelete, setChatToDelete] = useState<number | null>(null);
  const { t, i18n } = useTranslation();

  const handleDeleteRequest = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setChatToDelete(id);
  };

  const confirmDelete = () => {
    if (chatToDelete !== null) {
      onDeleteChat(chatToDelete);
      setChatToDelete(null);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={toggle} />
      )}

      <aside
        className={`
          fixed ${i18n.language === "ar" ? "left-0" : "right-0"} top-16
          h-[calc(100vh-64px)] w-[240px] sm:w-[260px] md:w-[190px]
          bg-[#3e6347] shadow-lg transition-transform duration-300 border-l border-emerald-800/20
          ${isOpen ? "translate-x-0 z-40" : i18n.language === "ar" ? "-translate-x-full" : "translate-x-full"}
          md:translate-x-0 md:z-30
        `}
      >
        <div className="h-full px-4 py-6 flex flex-col text-white">

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold">{t("ai.sidebarTitle")}</span>
            <button
              onClick={toggle}
              className="md:hidden text-white hover:bg-white/10 w-7 h-7 rounded-full flex items-center justify-center"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) toggle();
            }}
            className="w-full mb-4 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors border border-white/20 shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            <span className="text-sm font-medium">{t("ai.newChat")}</span>
          </button>

          <div className="border-t border-white/10 my-3" />

          <nav className="flex-1 overflow-y-auto custom-scrollbar pb-4">
            <ul className="flex flex-col gap-2">
              {chats.map((chat) => (
                <li key={chat.id} className="relative group">
                  <div
                    onClick={() => onSelectChat(chat.id)}
                    className="cursor-pointer w-full px-3 py-2 rounded-lg hover:bg-white/10 transition flex items-center justify-between"
                  >
                    <span className="text-sm truncate block text-white/90 group-hover:text-white max-w-[140px]">
                      {chat.title}
                    </span>

                    <button
                      onClick={(e) => handleDeleteRequest(e, chat.id)}
                      className="opacity-100 md:opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-300 transition-all p-1"
                      title={t("ai.deleteChat")}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto text-xs text-white/60 pt-4 text-center">
            {t("ai.copyright")}
          </div>
        </div>
      </aside>

      {chatToDelete !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          onClick={() => setChatToDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FBF7EF] w-full max-w-sm rounded-2xl p-6 border border-[#3e6347]/20 shadow-2xl"
          >
            <div className="text-center">

              <FiTrash2 className="h-10 w-10 text-red-600 mx-auto mb-4" />

              <h3 className="text-lg font-bold text-[#21492f]">
                {t("ai.confirmDeleteTitle")}
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                {t("ai.confirmDeleteDesc")}
                <br />
                <span className="text-xs text-red-500 font-medium">
                  {t("ai.cannotUndo")}
                </span>
              </p>
            </div>

            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition"
              >
                {t("ai.deleteConfirm")}
              </button>

              <button
                onClick={() => setChatToDelete(null)}
                className="flex-1 rounded-xl px-4 py-2 bg-white border text-gray-700 hover:bg-gray-50 transition"
              >
                {t("ai.cancel")}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
