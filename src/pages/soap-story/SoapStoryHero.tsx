import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const storyBg = "/images/soap_story.png";


const SoapStoryHero = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("soapStory");

  return (
    <section
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${storyBg})`,
        backgroundSize: "110% 110%",

        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Overlay Content */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          right: "10%",
          maxWidth: "520px",
          color: "#fff",
          textAlign: i18n.language === "ar" ? "right" : "left",
        }}
      >
        {/* Title */}
        <h1

          style={{
            direction: i18n.dir(),
            textAlign: i18n.language === "ar" ? "right" : "left",
            fontSize: "40px",
            color: "#3b2415",
            fontWeight: "800",
            marginBottom: "14px",
            lineHeight: "1.3",
            textShadow: "0 4px 10px rgba(0,0,0,0.5)",
            whiteSpace: "pre-line"
          }}
        >
          {t("hero.title")}
        </h1>

        {/* Description */}
        <p
          style={{
            direction: i18n.dir(),
            textAlign: i18n.language === "ar" ? "right" : "left",
            fontSize: "18px",
            lineHeight: "1.9",
            color: "#301e11",
            fontWeight: "500",
            marginBottom: "28px",
            textShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        >
          {t("hero.description")}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "14px", justifyContent: i18n.language === "ar" ? "flex-end" : "flex-start" }}>
          <button
            onClick={() => navigate("/soap-page")}
            style={{
              background: "#7a4a22",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: "12px",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            {t("hero.learnButton")}
          </button>

          <button
            onClick={() => navigate("/soap-buildings")}
            style={{
              background: "#2f6b4f",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: "12px",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            {t("hero.processButton")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SoapStoryHero;

