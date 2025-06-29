import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import http from "../../../util/http";

// ✅ TypingEffect Component (Fixed version)
const TypingEffect = ({ text, speed = 25, scrollRef }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text || typeof text !== "string") return;

    let index = 0;
    let cancelled = false;

    const typeNext = () => {
      if (cancelled || index >= text.length) return;

      setDisplayedText(text.slice(0, index + 1));

      if (scrollRef?.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }

      index++;
      setTimeout(typeNext, speed);
    };

    setDisplayedText(""); // Reset before typing
    typeNext();

    return () => {
      cancelled = true;
    };
  }, [text, speed, scrollRef]);

  return (
    <p className="text-base leading-relaxed whitespace-pre-line text-gray-600 mt-2">
      {displayedText}
    </p>
  );
};

// ✅ Chat Component
const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  const file = location.state?.file;

  const [userQuestion, setUserQuestion] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [responseList, setResponseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfPreviewUrl] = useState(file?.path || "");
  const [lastAnswerId, setLastAnswerId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchPdfText = async () => {
      if (!file?.path) {
        setError("❌ PDF file data not found.");
        return;
      }

      try {
        const response = await fetch(file.path);
        const arrayBuffer = await response.arrayBuffer();
        const typedArray = new Uint8Array(arrayBuffer);
        const loadingTask = window.pdfjsLib.getDocument({ data: typedArray });
        const pdf = await loadingTask.promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const text = content.items.map((item) => item.str).join(" ");
          fullText += text + "\n";
        }

        setPdfText(fullText);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to extract PDF text.");
      }
    };

    fetchPdfText();
  }, [file]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await http.get(`/api/chat/${id}`);
        const chatHistory = res.data.chats || [];

        const formattedChats = chatHistory.map((chat) => ({
          _id: chat._id,
          question: chat.question,
          answer: chat.answer,
          source: chat.fileTitle || "unknown",
        }));

        setResponseList(formattedChats);
      } catch (err) {
        console.error("❌ Failed to load previous chats:", err);
        setError("❌ Could not load previous chats.");
      }
    };

    fetchChatHistory();
  }, [id]);

  const handleAsk = async () => {
    if (!userQuestion.trim()) return;
    setLoading(true);
    setError("");

    try {
      const payload = [{
        userQuestion,
        pdfText,
        fileId: id,
        fileTitle: file?.title || "",
      }];

      const res = await http.post("/api/chat/", payload);
      const newChat = res.data.data?.[0];

      if (newChat) {
        setResponseList((prev) => [
          ...prev,
          {
            _id: newChat._id,
            question: newChat.question,
            answer: newChat.answer,
            source: newChat.fileTitle || "unknown",
          },
        ]);
        setLastAnswerId(newChat._id);
      }

      setUserQuestion("");
    } catch (err) {
      console.error("❌ API error:", err);
      setError("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatDownload = () => {
    if (!responseList.length) return;
    const chatContent = responseList.map((chat, i) =>
      `🔹 Question ${i + 1}: ${chat.question}\n🔸 Answer: ${chat.answer}\n📄 Source: ${chat.source}\n\n`
    ).join("");
    const blob = new Blob([chatContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.title || "chat"}_chat_history.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleDeleteChat = async (chatId) => {
    try {
      await http.delete(`/api/chat/${chatId}`);
      setResponseList((prev) => prev.filter((chat) => chat._id !== chatId));
    } catch (err) {
      console.error("❌ Failed to delete chat:", err);
      setError("❌ Could not delete chat.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responseList]);

  return (
    <div className="flex h-screen bg-white text-white font-inter absolute w-full top-0 left-0 z-[100000]">
      <div className="flex flex-col flex-1 relative">
        <button
          onClick={handleChatDownload}
          className="absolute right-8 z-[100] top-2 w-fit bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-700 px-4 py-2 rounded-lg font-medium"
        >
          <i className="ri-download-2-line mr-1"></i>
        </button>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {responseList.length > 0 ? (
            responseList.map((resp) => (
              <div key={resp._id} className="space-y-2">
                <div className="max-w-2xl p-4 rounded-lg border-[#2e2e2e]">
                  <p className="text-black mb-1 font-medium"><i className="ri-user-line"></i> Question</p>
                  <p className="text-base leading-relaxed text-gray-500">{resp.question} ?</p>
                </div>

                <div className="relative max-w-2xl p-4 border-b border-gray-200">
                  <p className="text-sm text-black mb-1 font-medium"><i className="ri-gemini-line"></i> Answer</p>
                  {resp._id === lastAnswerId && !loading ? (
                    <TypingEffect text={resp.answer} scrollRef={chatEndRef} speed={10} />
                  ) : (
                    <p className="text-base leading-relaxed whitespace-pre-line text-gray-600 mt-2">{resp.answer}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2"><i className="ri-file-text-line"></i> Source: {resp.source}</p>
                  <button
                    onClick={() => handleDeleteChat(resp._id)}
                    className="text-gray-500 text-lg cursor-pointer hover:text-red-600 absolute right-4 top-2"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-36 text-center px-4">
              <p className="text-lg text-gray-600 font-semibold flex justify-center items-center gap-2">
                <i className="ri-question-answer-line text-blue-500 text-xl"></i>
                Start by asking a question from the PDF below with AI
              </p>
            </div>


          )}
          <div ref={chatEndRef}></div>
        </div>

        <div className="px-6 py-4 border-t-2 border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your question..."
              className="flex-1 px-4 py-3 rounded-lg bg-[#1e1e1e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleAsk}
              disabled={loading}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-3 rounded-lg  disabled:opacity-50 transition-all"
            >
              {loading ? "Processing . . ." : <i className="ri-gemini-line"></i>}
            </button>
          </div>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>
      </div>

      {pdfPreviewUrl && (
        <div className="w-[47%] hidden lg:flex flex-col border-l border-[#1a1a1a]">
          <div className="p-4 border-b border-[#1a1a1a] flex justify-between">
            <h2 className="text-sm font-medium text-gray-600">📄 PDF Preview</h2>
            {file && (
              <div className="text-sm text-right text-black">
                <span className=" font-medium">✅ {file.title}</span>
                <p className="text-xs text-gray-500">ID: {file._id}</p>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <object
              data={pdfPreviewUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              className="w-full h-full border-none"
            >
              <p className="p-4 text-white text-sm">
                ⚠️ PDF preview not supported.
                <a
                  href={pdfPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline ml-1"
                >
                  Open in new tab
                </a>
              </p>
            </object>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
