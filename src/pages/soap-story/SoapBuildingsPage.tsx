import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React from "react";

const img1 = "/images/img1.png";
const img2 = "/images/img2.jpg";
const img3 = "/images/img3.jpg";
const soapVideo = "/images/videos/soap.mp4"

export default function SoapBuildingsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("soapStory");

  const para: React.CSSProperties = {
    fontSize: "18px",
    lineHeight: 1.95,
    color: "#3b2a1a",
    marginBottom: "18px",
    textAlign: "justify",
    textAlignLast: i18n.language === "ar" ? "right" : "left",
    textJustify: "inter-word"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6efe6",
        padding: "48px 0",
        direction: i18n.dir()
      }}
    >
      {/* ✅ شريط علوي بسيط */}
      <div
        style={{
          width: "min(1100px, 92%)",
          margin: "0 auto",
          display: "flex",
          justifyContent: i18n.language === "ar" ? "flex-end" : "flex-start",
          alignItems: "center",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "2px solid #5a3a24",
            color: "#5a3a24",
            padding: "10px 18px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {t("process.backButton")}
        </button>
      </div>

      {/* ✅ مربع العنوان فقط */}
      <div
        style={{
          width: "min(1100px, 92%)",
          margin: "0 auto 24px",
          background: "rgba(255,255,255,0.75)",
          border: "1px solid rgba(90,58,36,0.25)",
          borderRadius: "18px",
          padding: "32px 48px",
          boxShadow: "0 18px 60px rgba(0,0,0,0.10)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "38px",
            fontWeight: 900,
            color: "#4a2f1f",
            lineHeight: 1.2,
          }}
        >
          {t("process.title")}
        </h1>
      </div>


      {/* ✅ النص على الخلفية مباشرة */}
      <div
        style={{
          width: "min(1100px, 92%)",
          margin: "0 auto",
          color: "#3b2a1a",
        }}
      >
        <p
          style={{
            marginTop: "12px",
            marginBottom: "18px",
            fontSize: "18px",
            color: "#3b2a1a",
            lineHeight: 1.9,
          }}
        >
          {t("process.intro")}
        </p>

        {/* قسم 1 */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "32px",
            flexDirection: i18n.language === "ar" ? "row" : "row-reverse"
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={para}>{t("process.section1")}</p>
          </div>

          <div style={{ width: "30%", textAlign: "center" }}>
            <img
              src={img1}
              alt={t("process.fig1")}
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                objectFit: "cover",
              }}
            />
            <div style={{ marginTop: "6px", fontSize: "14px", color: "#6b4a32" }}>
              {t("process.fig1")}
            </div>
          </div>
        </div>

        <p style={para}>{t("process.section2")}</p>
        <p style={para}>{t("process.section3")}</p>

        {/* قسم 4 */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "32px",
            flexDirection: i18n.language === "ar" ? "row" : "row-reverse"
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={para}>{t("process.section4")}</p>
          </div>

          <div style={{ width: "30%", textAlign: "center" }}>
            <img
              src={img2}
              alt={t("process.fig2")}
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                objectFit: "cover",
              }}
            />
            <div style={{ marginTop: "6px", fontSize: "14px", color: "#6b4a32" }}>
              {t("process.fig2")}
            </div>
          </div>
        </div>

        <p style={para}>{t("process.section5")}</p>

        {/* قسم 6 */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "32px",
            flexDirection: i18n.language === "ar" ? "row" : "row-reverse"
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={para}>{t("process.section6")}</p>
          </div>

          <div style={{ width: "30%", textAlign: "center" }}>
            <img
              src={img3}
              alt={t("process.fig3")}
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                objectFit: "cover",
              }}
            />
            <div style={{ marginTop: "6px", fontSize: "14px", color: "#6b4a32" }}>
              {t("process.fig3")}
            </div>
          </div>
        </div>

        <p style={para}>{t("process.section7")}</p>

        {/* خاتمة */}
        <div
          style={{
            marginTop: "22px",
            padding: "16px",
            borderRadius: "14px",
            border: "1px solid rgba(90,58,36,0.25)",
            background: "rgba(90,58,36,0.06)",
          }}
        >
          <div
            style={{
              marginTop: "28px",
              padding: "18px",
              borderRadius: "14px",
              border: "1px solid rgba(90,58,36,0.25)",
              background: "rgba(90,58,36,0.06)",
            }}
          >
            <p style={{ ...para, marginBottom: "12px", fontWeight: 700 }}>
              {t("process.videoTitle")}
            </p>

            <div style={{ position: "relative" }}>
              <video
                controls
                style={{
                  width: "100%",
                  borderRadius: "12px",
                }}
              >
                <source src={soapVideo} type="video/mp4" />
                المتصفح لا يدعم تشغيل الفيديو
              </video>

              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "10px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  background: "rgba(0,0,0,0.35)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                }}
              >
                {t("process.videoRights")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


