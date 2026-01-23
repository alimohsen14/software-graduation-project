type Props = {
  title: string;
  image: string;
  text: string;
};

export default function IndustryCard({ title, image, text }: Props) {
  return (
    <div className="industry-card">
      <img src={image} className="industry-img" alt={title} />

      <div className="industry-overlay">
        <div className="industry-text-box">
          {text}
        </div>
      </div>

      <div className="industry-title-bar">{title}</div>
    </div>
  );
}
