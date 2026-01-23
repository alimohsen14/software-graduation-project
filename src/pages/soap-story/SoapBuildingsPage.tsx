import { useNavigate } from "react-router-dom";
import React from "react";

const img1 = "/images/img1.png";
const img2 = "/images/img2.jpg";
const img3 = "/images/img3.jpg";
const soapVideo = "/images/videos/soap.mp4"

export default function SoapBuildingsPage() {
  const navigate = useNavigate();

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f6efe6", // تراثي فاتح
        padding: "48px 0",
      }}
    >
      {/* ✅ شريط علوي بسيط */}
      <div
        style={{
          width: "min(1100px, 92%)",
          margin: "0 auto",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "12px",
          marginBottom: "18px",
          direction: "rtl",
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
          رجوع
        </button>


      </div>

      {/* ✅ صندوق المقال + سكرول */}
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
          direction: "rtl",
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
          الصبّانات النابلسية
        </h1>
      </div>


      {/* ✅ النص على الخلفية مباشرة */}
      <div
        style={{
          width: "min(1100px, 92%)",
          margin: "0 auto",
          direction: "rtl",
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
          من مئات السنين، كانت نابلس محاطة بجبال خضراء مليئة بأشجار الزيتون.
          رحّالة ومؤرخون مثل ابن بطوطة ومجير الدين الحنبلي وصفوا المدينة بأنها من أكثر مدن الشام غنى بالزيت والزيتون، وكان زيت نابلس يُحمل إلى مصر ودمشق وحتى الحجاز
          ومن هذا الزيت النقي وُلد واحد من أنقى أنواع الصابون في المنطقة: الصابون النابلسي
        </p>
        {/* قسم 1 */}

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "32px",
          }}
        >
          {/* النص */}
          <div style={{ flex: 1 }}>
            <p style={para}>
              تبدأ الحكاية في قلب المصبنة، في الطابق الأرضي الذي خُصِّص لطبخ الصابون،
              حيث ترتفع في وسطه حِلّة نحاسية ضخمة، سميكة القاعدة،
              واسعة القطر، عميقة الجوف، بُنيت حولها حجارة نارية لتحفظ الحرارة.
              لم تكن هذه الحِلّة صغيرة أو عادية، بل كانت تتسع لكميات هائلة من زيت الزيتون،  (انظر إلى الشكل 1)
              تزيد على خمسة أطنان في الطبخة الواحدة،
              إلى جانب المواد الأخرى التي تدخل في صناعة الصابون.
              وتحت هذا الموضع مباشرة تقع غرفة القميم،
              حيث تُشعل النار باستمرار لتسخين الحلة من الأسفل،
              ويصعد الدخان عبر ممرات خاصة صُممت داخل البناء.
            </p>
          </div>

          {/* الصورة + العنوان */}
          <div style={{ width: "30%", textAlign: "center" }}>
            <img
              src={img1}
              alt="الشكل 1"
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                objectFit: "cover",
              }}
            />

            {/* النص تحت الصورة */}
            <div
              style={{
                marginTop: "6px",
                fontSize: "14px",
                color: "#6b4a32",
              }}
            >
              الشكل (1): حِلّة طبخ الصابون داخل المصبنة
            </div>
          </div>
        </div>


        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "28px",
          }}
        >
          {/* النص */}

        </div>


        <p style={para}>
          ومع اشتعال النار، تبدأ مرحلة الطبخ،
          حيث يُضاف زيت الزيتون إلى الحلة،
          ثم يُضاف إليه ماء الخُمري،
          وهو ماء يحتوي على الصودا بعد إذابتها ومعالجتها. لم تكن هذه الإضافة تتم مرة واحدة،
          بل كانت تُكرر عدة مرات وفق نظام دقيق،
          إذ يُسحب ماء الخُمري من أسفل الحلة إلى أحواض خاصة،
          ثم يُعاد تركيزه ويُعاد سكبه فوق الزيت مرة أخرى،
          في عملية تُعرف بالردّة. وخلال هذه الدورة المتكررة،
          يُحرَّك المزيج داخل الحلة بأداة خشبية طويلة تُستخدم خصيصًا لهذه المهمة،
          إلى أن يبدأ الزيت بالتحول التدريجي إلى صابون.
        </p>

        <p style={para}>
          ومع استمرار الطبخ، كان العمال يراقبون بدقة تفاعل المواد داخل الحلة،
          فزيادة الصودا أو نقصانها قد تُفسد الطبخة كلها.
          ولهذا كانت مسؤولية مراقبة النضج تقع على عاتق رئيس العمال،
          الذي يستخدم أداة خشبية أسطوانية تُغمس في الصابون ثم تُفحص رائحته وقوامه بين اليدين،
          ليتأكد أن عملية التصبن قد اكتملت،
          وأن الزيت قد تحوّل بالكامل إلى صابون صالح للبسط والتشكيل.
        </p>


        {/* قسم 4 */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "32px",
          }}
        >
          {/* النص */}
          <div style={{ flex: 1 }}>
            <p style={para}>
              وعندما يكتمل نضج الصابون داخل الحلة، تبدأ مرحلة نقله إلى الطابق العلوي،
              المعروف بالمفرش. كان هذا الطابق واسعًا، ذا نوافذ كبيرة تسمح بدخول الضوء والهواء،
              (انظر إلى الشكل 2) وقد صُمم خصيصًا لهذه المرحلة من العمل. يُسكب الصابون الساخن على أرضية المفرش،
              ثم يُبسط بعناية ليأخذ سماكة متساوية في جميع أجزائه،
              ويُسوّى سطحه باستخدام أدوات مخصصة لذلك،
              حتى يتحول إلى طبقة كبيرة مستوية تغطي أرض المكان.
            </p>
          </div>

          {/* الصورة + العنوان */}
          <div style={{ width: "30%", textAlign: "center" }}>
            <img
              src={img2}
              alt="الشكل 2"
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                objectFit: "cover",
              }}
            />

            {/* النص تحت الصورة */}
            <div
              style={{
                marginTop: "6px",
                fontSize: "14px",
                color: "#6b4a32",
              }}
            >
              الشكل (2)
            </div>
          </div>
        </div>



        {/* قسم 5 */}

        <p style={para}>
          وبعد أن يبرد الصابون قليلًا، تبدأ مرحلة التخطيط والتقطيع.
          تُرسم خطوط مستقيمة على سطح الصابون لتقسيمه إلى مربعات متساوية،
          ثم تُدمغ كل قطعة بختم المصبنة الذي يحمل علامتها، باستخدام مطرقة خشبية وختم معدني.
          وبعد ذلك تُقطّع القطع إلى مكعبات صغيرة متساوية الحجم تُعرف باسم الفلَق،
          ويُعاد ترتيبها على الأرض استعدادًا لمرحلة التجفيف.
        </p>

        {/* قسم 6 */}

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "28px",
          }}
        >
          {/* النص */}

          <div
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "flex-start",
              marginBottom: "32px",
            }}
          >
            {/* النص */}
            <div style={{ flex: 1 }}>
              <p style={para}>
                ولا ينتهي العمل عند هذا الحد،
                فالصابون يحتاج إلى وقت طويل ليجف ويقسو ويصبح صالحًا للاستعمال.
                (انظر الى الشكل 3) ولهذا تُكدّس القطع فوق بعضها على شكل أبراج مخروطية مجوّفة تُعرف بالتنانير،
                ويُترك بينها فراغ يسمح بمرور الهواء،
                فتجف القطع تدريجيًا على مدى أسابيع،
                وقد يمتد ذلك إلى شهر أو أكثر، بحسب الرطوبة والحرارة.
              </p>
            </div>

            {/* الصورة + العنوان */}
            <div style={{ width: "30%", textAlign: "center" }}>
              <img
                src={img3}
                alt="الشكل 3"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                  objectFit: "cover",
                }}
              />

              {/* النص تحت الصورة */}
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "14px",
                  color: "#6b4a32",
                }}
              >
                الشكل (3)
              </div>
            </div>
          </div>

        </div>


        <p style={para}>
          وعندما تكتمل عملية التجفيف، تُفكك التنانير،
          ويُلف كل قالب من الصابون بورق يحمل اسم المصبنة المنتِجة،
          ثم تُجمع القطع في أكياس أو صناديق استعداداً لنقلها وبيعها.
          وهكذا تنتهي رحلة طويلة بدأت بزيت الزيتون في آبار المصبنة،
          وانتهت بقطع صابون جاهزة تنتقل من قلب نابلس إلى البيوت والأسواق.
        </p>

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
              ✨ شاهد الفيديو التالي:
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

              {/* حقوق خفيفة */}
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
                الحقوق:  @abedkababjj8325

              </div>
            </div>
          </div>


        </div>
      </div>
    </div>

  );
}
const para: React.CSSProperties = {
  fontSize: "18px",
  lineHeight: 1.95,
  color: "#3b2a1a",
  marginBottom: "18px",
  textAlign: "justify",
  textAlignLast: "right",
  textJustify: "inter-word"
};

