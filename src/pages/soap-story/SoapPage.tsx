import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React from "react";

const plan = "/images/plan.png";
const magrash = "/images/magrash.png";
const gnd = "/images/gnd.png";

const SoapPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("soapStory");

  const para: React.CSSProperties = {
    fontSize: "16px",
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
        direction: i18n.dir(),
        textAlign: i18n.language === "ar" ? "right" : "left",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4ead7, #e6d3b3)",
        padding: "80px 10%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          direction: i18n.dir(),
          textAlign: i18n.language === "ar" ? "right" : "left",
          maxWidth: "900px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.65)",
          padding: "40px",
          borderRadius: "22px",
          lineHeight: "2",
          color: "#3b2415",
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: "32px" }}>
            {t("buildings.title")}
          </h1>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              border: "2px solid #5a3a24",
              color: "#5a3a24",
              padding: "8px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {t("process.backButton")}
          </button>
        </div>

        <p>{t("buildings.intro1")}</p>
        <p>{t("buildings.intro2")}</p>
        <p>{t("buildings.intro3")}</p>

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            margin: "20px 0 28px",
            flexDirection: i18n.language === "ar" ? "row" : "row-reverse"
          }}
        >
          <p style={{ ...para, flex: 1 }}>{t("buildings.characteristic")}</p>

          <div style={{ width: "32%", textAlign: "center" }}>
            <img
              src={plan}
              alt={t("buildings.title")}
              style={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                objectFit: "cover",
              }}
            />
            <div style={{ marginTop: "6px", fontSize: "14px", color: "#6b4a32" }}>
              {t("buildings.fig1")}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "28px",
            direction: i18n.dir(),
            flexDirection: i18n.language === "ar" ? "row" : "row-reverse"
          }}
        >
          <p style={{ ...para, flex: 1 }}>{t("buildings.floor1")}</p>

          <div style={{ width: "32%", textAlign: "center" }}>
            <img
              src={magrash}
              alt={t("buildings.title")}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
              }}
            />
            <div style={{ marginTop: "6px", fontSize: "14px", color: "#6b4a32" }}>
              {t("buildings.fig2")}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "28px",
            direction: i18n.dir(),
            flexDirection: i18n.language === "ar" ? "row" : "row-reverse"
          }}
        >
          <p style={{ ...para, flex: 1 }}>{t("buildings.groundFloor")}</p>

          <div style={{ width: "32%", textAlign: "center" }}>
            <img
              src={gnd}
              alt={t("buildings.title")}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
              }}
            />
            <div style={{ marginTop: "6px", fontSize: "14px", color: "#6b4a32" }}>
              {t("buildings.fig3")}
            </div>
          </div>
        </div>

        <p>{t("buildings.underground")}</p>
        <p>{t("buildings.cookingProcess")}</p>
        <p>{t("buildings.office")}</p>
      </div>
    </div>
  );
};

export default SoapPage;

