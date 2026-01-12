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
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-md z-30 md:hidden" onClick={toggle} />
      )}

      <aside
        className={`
          fixed ${i18n.language === "ar" ? "left-0" : "right-0"} top-0 md:top-16
          h-full md:h-[calc(100vh-64px)] w-[280px] sm:w-[320px] md:w-[190px]
          bg-zinc-950/40 backdrop-blur-3xl shadow-2xl transition-all duration-500 border-l border-white/10
          ${isOpen ? "translate-x-0 z-40" : i18n.language === "ar" ? "-translate-x-full" : "translate-x-full"}
          md:translate-x-0 md:z-30
        `}
      >
        <div className="h-full px-6 py-8 flex flex-col text-white relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{t("ai.sidebarTitle")}</span>
            <button
              onClick={toggle}
              className="md:hidden w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) toggle();
            }}
            className="w-full mb-8 flex items-center justify-center gap-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 py-4 rounded-2xl transition-all hover:bg-emerald-600/30 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95 group relative overflow-hidden"
          >
            <FiPlus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t("ai.newChat")}</span>
          </button>

          <div className="w-full h-px bg-white/5 mb-6" />

          <nav className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6 relative z-10">
            <ul className="flex flex-col gap-3">
              {chats.map((chat) => (
                <li key={chat.id} className="relative group/item">
                  <div
                    onClick={() => onSelectChat(chat.id)}
                    className="cursor-pointer w-full px-4 py-3 rounded-2xl bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-center justify-between group"
                  >
                    <span className="text-[11px] font-bold truncate block text-white/30 group-hover:text-white transition-colors max-w-[140px] uppercase tracking-tighter">
                      {chat.title}
                    </span>

                    <button
                      onClick={(e) => handleDeleteRequest(e, chat.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/10 hover:text-red-400 transition-all p-2 bg-white/0 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10"
                      title={t("ai.deleteChat")}
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto text-[9px] font-black uppercase tracking-[0.3em] text-white/20 pt-6 text-center border-t border-white/5 relative z-10">
            {t("ai.copyright")}
          </div>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      {chatToDelete !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-300"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          onClick={() => setChatToDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950/40 backdrop-blur-2xl w-full max-w-sm rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300"
          >
            {/* Background decorative glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-red-500/10 rounded-[1.5rem] flex items-center justify-center border border-red-500/20 mx-auto mb-6 text-red-500 relative">
                <FiTrash2 className="w-8 h-8" />
                <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-50" />
              </div>

              <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
                {t("ai.confirmDeleteTitle")}
              </h3>

              <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                {t("ai.confirmDeleteDesc")}
                <br />
                <span className="text-red-500/60 font-black mt-2 block">
                  {t("ai.cannotUndo")}
                </span>
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 relative z-10">
              <button
                onClick={confirmDelete}
                className="w-full rounded-2xl px-6 py-4 bg-red-600/20 text-red-500 border border-red-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-red-600/30 transition-all active:scale-95 shadow-xl shadow-red-500/5"
              >
                {t("ai.deleteConfirm")}
              </button>

              <button
                onClick={() => setChatToDelete(null)}
                className="w-full rounded-2xl px-6 py-4 bg-white/5 border border-white/10 text-white/30 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:text-white transition-all active:scale-95"
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
