import React, { useState } from "react";

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
  // state عشان نعرف أي شات بدنا نحذفه، إذا null يعني فش اشي بده حذف حالياً
  const [chatToDelete, setChatToDelete] = useState<number | null>(null);

  // لما يكبس على أيقونة الزبالة
  const handleDeleteRequest = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setChatToDelete(id); // بنفتح المودال لهذا الشات
  };

  // التأكيد النهائي للحذف
  const confirmDelete = () => {
    if (chatToDelete !== null) {
      onDeleteChat(chatToDelete);
      setChatToDelete(null); // بنسكر المودال
    }
  };

  return (
    <>
      {/* 1. طبقة التظليل للموبايل (لما تفتح القائمة الجانبية) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggle}
        />
      )}

      {/* 2. السايد بار نفسه */}
      <aside
        className={`
        fixed right-0 top-16 h-[calc(100vh-64px)] w-[240px] sm:w-[260px] md:w-[190px]
        bg-[#3e6347] shadow-lg transition-transform duration-300 border-l border-emerald-800/20
        ${isOpen ? "translate-x-0 z-40" : "translate-x-full z-10"}
        md:translate-x-0 md:z-30
      `}
      >
        <div className="h-full px-4 py-6 flex flex-col text-white">
          {/* الترويسة وزر الإغلاق للموبايل */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold">Palestine AI</span>
            <button
              onClick={toggle}
              className="md:hidden text-white hover:bg-white/10 w-7 h-7 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* زر محادثة جديدة */}
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) toggle();
            }}
            className="w-full mb-4 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors border border-white/20 shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-sm font-medium">محادثة جديدة</span>
          </button>

          <div className="border-t border-white/10 my-3" />

          {/* قائمة المحادثات */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar pb-4">
            <ul className="flex flex-col gap-2">
              {chats.map((chat) => (
                <li key={chat.id} className="relative group">
                  <div
                    onClick={() => onSelectChat(chat.id)}
                    className="cursor-pointer w-full text-right px-3 py-2 rounded-lg hover:bg-white/10 transition flex items-center justify-between"
                  >
                    <span className="text-sm truncate block text-white/90 group-hover:text-white max-w-[140px]">
                      {chat.title}
                    </span>

                    {/* زر الحذف يظهر عند الـ Hover */}
                    <button
                      onClick={(e) => handleDeleteRequest(e, chat.id)}
                      className="opacity-100 md:opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-300 transition-all p-1"
                      title="حذف المحادثة"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto text-xs text-white/60 pt-4 text-center">
            Palestine3D AI System
          </div>
        </div>
      </aside>

      {/* ============================================== */}
      {/* 3. نافذة التأكيد (Custom Modal) */}
      {/* ============================================== */}
      {chatToDelete !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          dir="rtl"
          onClick={() => setChatToDelete(null)} // تسكير عند الضغط برا
        >
          {/* محتوى المودال */}
          <div
            onClick={(e) => e.stopPropagation()} // منع الإغلاق عند الضغط جوا
            className="bg-[#FBF7EF] w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-[#3e6347]/20 transform scale-100 animate-in zoom-in-95 duration-200"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h3 className="text-lg leading-6 font-bold text-[#21492f]">
                حذف المحادثة؟
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                هل أنت متأكد من رغبتك في حذف هذه المحادثة نهائيًا؟
                <br />
                <span className="text-xs text-red-500 font-medium">
                  لا يمكن التراجع عن هذا الإجراء.
                </span>
              </p>
            </div>

            <div className="mt-6 flex gap-3 justify-center">
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm transition-colors"
              >
                نعم، احذف
              </button>

              <button
                type="button"
                onClick={() => setChatToDelete(null)}
                className="flex-1 inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3e6347] sm:text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
