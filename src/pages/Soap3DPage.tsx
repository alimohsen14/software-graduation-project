import React from "react";
import Soap3DHero from "../components/sope3d/hero/Soap3DHero";
import Soap3DAbout from "../components/sope3d/about/Soap3DAbout";
import Soap3DMethod from "../components/sope3d/method/Soap3DMethod";
import Soap3DTimeline from "../components/sope3d/timeline/Soap3DTimeline";
import Soap3DQuote from "../components/sope3d/quote/Soap3DQuote";

function Soap3DPage() {
  return (
    <>
      <Soap3DHero />
      <Soap3DAbout />
      <Soap3DMethod />
      <Soap3DTimeline />
      <Soap3DQuote />
    </>
  );
}

export default Soap3DPage;
