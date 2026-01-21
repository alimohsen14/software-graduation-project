import React from "react";
import { useTranslation } from "react-i18next";
import { FiPlus, FiMessageSquare, FiTrash2, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

type Chat = {
  id: number;
  title: string;
  createdAt: string;
};

type Props = {
  isOpen: boolean;
  toggle: () => void;
  chats: Chat[];
  onSelectChat: (chatId: number) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: number) => void;
};

export default function AISidebar({
  isOpen,
  toggle,
  chats,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: Props): React.ReactElement {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const direction = i18n.dir();

  const [deletingChatId, setDeletingChatId] = React.useState<number | null>(null);

  const confirmDelete = () => {
    if (deletingChatId !== null) {
      onDeleteChat(deletingChatId);
      setDeletingChatId(null);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar - Floating fixed panel attached to edge */}
      <aside
        className={`
          fixed z-50
          top-16 bottom-0
          w-[320px]
          flex flex-col
          bg-[#0a0a0a]/80 backdrop-blur-2xl
          border-white/10
          ${direction === "rtl" ? "left-0 border-r" : "right-0 border-l"}
          shadow-2xl shadow-black
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : direction === "rtl" ? "-translate-x-full" : "translate-x-full"}
          md:translate-x-0
        `}
        dir={direction}
      >
        {/* Close button - Mobile only */}
        <button
          onClick={toggle}
          className="md:hidden absolute top-4 left-4 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-black text-white/90 tracking-tight mb-1">
            {t("ai.sidebarTitle")}
          </h2>
          <p className="text-xs text-white/50 font-medium lowercase">
            {user?.name || "Guest User"}
          </p>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <FiPlus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span className="text-sm">{t("ai.newChat")}</span>
          </button>
        </div>

        {/* Chat History List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 scrollbar-hide">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="group relative px-5 py-3 rounded-xl cursor-pointer bg-transparent hover:bg-white/5 text-white/60 hover:text-white/90 transition-all duration-300"
            >
              <div className="flex items-start gap-3.5">
                <div className="text-white/40 group-hover:text-white/80">
                  <FiMessageSquare className="w-4.5 h-4.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium mb-0.5 truncate tracking-wide">
                    {chat.title}
                  </p>
                  <p className="text-[10px] text-white/30">
                    {new Date(chat.createdAt).toLocaleDateString(i18n.language, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingChatId(chat.id);
                  }}
                  className="p-1.5 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  title={t("ai.deleteChat")}
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 text-center">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            {t("ai.copyright")}
          </p>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      {deletingChatId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in duration-300">
            <h3 className="text-xl font-bold text-white mb-2">{t("ai.deleteConfirmationTitle")}</h3>
            <p className="text-white/60 text-sm mb-6">
              {t("ai.deleteConfirmationDesc")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingChatId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
              >
                {t("ai.cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all"
              >
                {t("ai.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
