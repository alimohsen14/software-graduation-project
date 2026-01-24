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
  const { t, i18n } = useTranslation("ai");
  const { user } = useAuth();
  const direction = i18n.dir();
  const isRtl = direction === "rtl";

  const [deletingChatId, setDeletingChatId] = React.useState<number | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const confirmDelete = async () => {
    if (deletingChatId !== null) {
      setIsDeleting(true);
      try {
        await onDeleteChat(deletingChatId);
      } finally {
        setIsDeleting(false);
        setDeletingChatId(null);
      }
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

      {/* Sidebar - Exact same style as main sidebar */}
      <aside
        className={`fixed top-16 bottom-0 ${isRtl ? "left-0" : "right-0"} w-64 z-40 transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : isRtl ? "-translate-x-full" : "translate-x-full"
          } bg-white/5 backdrop-blur-sm ${isRtl ? "border-l" : "border-r"} border-white/10 shadow-md shadow-black/20 flex flex-col pointer-events-auto md:translate-x-0`}
        dir={direction}
      >
        {/* Close button - Mobile only */}
        <button
          onClick={toggle}
          className={`md:hidden absolute top-4 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors ${isRtl ? "right-4" : "left-4"}`}
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-4 pt-12 pb-4">
          <h2 className="text-lg font-black text-white tracking-tight mb-1">
            {t("sidebarTitle")}
          </h2>
          <p className="text-[10px] text-white/40 font-medium">
            {user?.name || "Guest User"}
          </p>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pb-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/5 active:scale-95"
          >
            <FiPlus className="w-4.5 h-4.5" />
            <span>{t("newChat")}</span>
          </button>
        </div>

        {/* Chat History List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
          <nav className="space-y-1.5">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="group relative"
              >
                <button
                  className={`w-full flex items-center ${isRtl ? "flex-row-reverse text-right" : "flex-row text-left"} gap-3.5 px-5 py-3 rounded-xl transition-all duration-300 text-white/60 hover:text-white/90 hover:bg-white/5`}
                >
                  <FiMessageSquare className="w-4.5 h-4.5 text-white/40 group-hover:text-white/80" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] tracking-wide font-medium truncate">
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
                    title={t("deleteChat")}
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            {t("copyright")}
          </p>
        </div>
      </aside>

      {/* Delete Confirmation Modal - Cleaner design */}
      {deletingChatId !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !isDeleting && setDeletingChatId(null)}
        >
          <div
            className="bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-2">{t("delete.title")}</h3>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              {t("delete.desc")}
            </p>
            <div className={`flex gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setDeletingChatId(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all disabled:opacity-50"
              >
                {t("delete.cancel")}
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting && (
                  <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                )}
                <span>{t("delete.confirm")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
