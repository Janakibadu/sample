// Fixed full-width funder-logo banner shown at the bottom of every page.
export default function FunderBar() {
  return (
    <div className="funder-bar">
      <img className="funder-logo-tud" src="/img/tud_logo_cmyk.png" alt="TU Dortmund Logo" />
      <img src="/img/IFS.png" alt="IFS Logo" />
      <img src="/img/speak-logo.png" alt="SPEAK Logo" />
      <img className="funder-logo-bund" src="/img/Bundesministrerium.jpg" alt="Bundesministerium Logo" />
      <img src="/img/EBF.jpg" alt="EBF Logo" />
    </div>
  );
}
