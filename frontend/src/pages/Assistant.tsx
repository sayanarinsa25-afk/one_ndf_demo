import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";
import "../styles/assistant.css";

interface Msg {
  role: "user" | "assistant" | "system";
  content: string;
}

const LOAN_TYPES = ["Personal Loan", "Home Loan", "Business Loan", "Car Loan"];

export default function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [progress, setProgress] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ---------- Auto scroll ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, progress]);

  /* ---------- Greeting detector ---------- */
  const isGreeting = (text: string) => {
    const t = text.toLowerCase().trim();
    return ["hi", "hello", "hey", "hii"].some((g) => t.startsWith(g));
  };

  /* ---------- Typing helper ---------- */
  const typeMessage = (content: string, delay = 800) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content }]);
      setTyping(false);
    }, delay);
  };

  /* ---------- Voice input ---------- */
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Voice not supported in this browser");

    const recog = new SpeechRecognition();
    recog.lang = "en-IN";
    recog.start();

    recog.onresult = (e: any) => {
      setInput(e.results[0][0].transcript);
    };
  };

  /* ---------- Send message ---------- */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((p) => [...p, { role: "user", content: userMsg }]);
    setInput("");

    if (isGreeting(userMsg)) {
      typeMessage(
        "I'm your Finance AI Automation Assistant. I help automate the loan processing workflow.\n\nPlease select a loan type."
      );

      setMessages((p) => [...p, { role: "system", content: "loan-options" }]);
      return;
    }

    try {
      const res = await api.post("/assistant/chat", {
        message: userMsg,
        chat_id: chatId,
      });

      setChatId(res.data.chat_id);
      typeMessage(res.data.reply);
    } catch {
      typeMessage("Demo AI response: backend not connected.");
    }
  };

  /* ---------- Random finance generator ---------- */
  const generateFinanceResult = () => {
    const riskScore = Math.floor(Math.random() * 55) + 35;

    let category = "Medium Risk";
    let decision = "REVIEW";

    if (riskScore >= 70) {
      category = "Low Risk";
      decision = "APPROVE";
    } else if (riskScore < 50) {
      category = "High Risk";
      decision = "REJECT";
    }

    const loanAmount = (Math.floor(Math.random() * 9) + 1) * 100000;
    const emi = Math.floor(loanAmount / 48);

    const portfolioStates = ["Stable", "Moderate", "Elevated"];
    const portfolioRisk =
      portfolioStates[Math.floor(Math.random() * portfolioStates.length)];

    const npa = (Math.random() * 5 + 1.2).toFixed(1);

    return { riskScore, category, decision, loanAmount, emi, portfolioRisk, npa };
  };

  /* ---------- Fake PDF download ---------- */
  const downloadPDF = (data: any) => {
    const blob = new Blob(
      [
        `AI Loan Approval Report

Risk Score: ${data.riskScore} (${data.category})
Decision: ${data.decision}
Loan Amount: ₹${data.loanAmount.toLocaleString()}
EMI: ₹${data.emi.toLocaleString()}/month
Portfolio Risk: ${data.portfolioRisk}
Expected NPA: ${data.npa}%`,
      ],
      { type: "application/pdf" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_Loan_Report.pdf";
    a.click();
  };

  /* ---------- Run automation simulation ---------- */
  const runAutomation = async () => {
    if (!file || !selectedLoan) return;

    const steps = [
      "Reading documents...",
      "Running OCR extraction...",
      "Checking credit bureau...",
      "Calculating FOIR...",
      "Generating AI risk score...",
    ];

    setProgress(5);

    steps.forEach((step, i) => {
      setTimeout(() => {
        setProgress((i + 1) * 18);
        typeMessage(step, 400);
      }, i * 900);
    });

    const result = generateFinanceResult();

    setTimeout(() => {
      setProgress(100);

      typeMessage(
        `AI Credit Evaluation Complete ✅

Risk Score: ${result.riskScore} (${result.category})
Decision: ${result.decision}
Loan Amount: ₹${result.loanAmount.toLocaleString()}
EMI: ₹${result.emi.toLocaleString()}/month

Portfolio Risk: ${result.portfolioRisk}
Expected NPA: ${result.npa}%

⚠️ Demo version — contact ARINSA AI MINDS for real automation.`,
        600
      );

      setMessages((p) => [
        ...p,
        { role: "system", content: "download-pdf-" + JSON.stringify(result) },
      ]);

      setFile(null);
      setSelectedLoan(null);
    }, steps.length * 900 + 900);
  };

  return (
    <Layout>
      <div className="assistant-page">
        <div className="chat-card">
          <div className="chat-messages">
            {messages.map((m, i) => {
              if (m.role === "system" && m.content === "loan-options") {
                return (
                  <div key={i} className="loan-options">
                    {LOAN_TYPES.map((loan) => (
                      <button
                        key={loan}
                        className={`loan-btn ${
                          selectedLoan === loan ? "active" : ""
                        }`}
                        onClick={() => setSelectedLoan(loan)}
                      >
                        {loan}
                      </button>
                    ))}
                  </div>
                );
              }

              if (m.role === "system" && m.content.startsWith("download-pdf-")) {
                const data = JSON.parse(m.content.replace("download-pdf-", ""));
                return (
                  <button key={i} className="pdf-btn" onClick={() => downloadPDF(data)}>
                    Download Approval PDF
                  </button>
                );
              }

              return (
                <div key={i} className={`chat-row ${m.role === "user" ? "right" : "left"}`}>
                  <div className={`bubble ${m.role}`}>{m.content}</div>
                </div>
              );
            })}

            {typing && <div className="typing">AI is typing...</div>}

            {progress > 0 && progress < 100 && (
              <div className="progress-bar">
                <div style={{ width: `${progress}%` }} />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="chat-footer">
            <div className="upload-row">
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <button className="upload-btn" disabled={!file || !selectedLoan} onClick={runAutomation}>
                Run Automation
              </button>
            </div>

            <div className="input-row">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type Hi to start..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
              <button onClick={startVoice}>🎤</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
