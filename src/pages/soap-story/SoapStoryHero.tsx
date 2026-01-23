import { useNavigate } from "react-router-dom";
const storyBg = "/images/soap_story.png";


const SoapStoryHero = () => {
  const navigate = useNavigate();

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
          textAlign: "right",
        }}
      >
        {/* Title */}
        <h1

          style={{
            direction: "rtl",
            textAlign: "right",
            fontSize: "40px",
            color: "#3b2415",
            fontWeight: "800",
            marginBottom: "14px",
            lineHeight: "1.3",
            textShadow: "0 4px 10px rgba(0,0,0,0.5)",
          }}
        >
          المصابن والصابون النابلسي
          <br />
          من شجرة الزيتون بدأت الحكاية🌿
        </h1>

        {/* Description */}
        <p
          style={{
            direction: "rtl",
            textAlign: "right",
            fontSize: "18px",
            lineHeight: "1.9",
            color: "#301e11",
            fontWeight: "500",
            marginBottom: "28px",
            textShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        >
          لم تكن الصبّانة مجرد مكان لصناعة الصابون، بل كانت قلبًا نابضًا بالحياة
          الاقتصادية والاجتماعية في نابلس، ومَعلمًا يعكس مكانة أصحابها ونفوذهم،
          وحرفة توارثها الناس جيلًا بعد جيل.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "14px", justifyContent: "flex-end" }}>
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
            تعرّف على الصبّانات
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
            اكتشف كيف يُصنع الصابون النابلسي
          </button>
        </div>
      </div>
    </section>
  );
};

export default SoapStoryHero;
