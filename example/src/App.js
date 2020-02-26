import React from "react";
import styled from "styled-components";
import { Slider } from "react-stack-slider";
import Markdown from "markdown-to-jsx";
import infoIcon from "./images/info-icon.svg";
import persephoneReturn from "./images/persephone-return.png";
import proserpineAbduction from "./images/proserpine-abduction.png";

const RoundedImage = styled.img`
  display: block;
  overflow: hidden;
  border-radius: 32px;
  width: ${({ width }) => width || "auto"};
  height: ${({ height }) => height || "auto"};
`;

const WrapperEl = styled.div`
  display: inline-block;
  overflow: hidden;
  position: relative;
  border-radius: 32px;
  width: ${({ width }) => width || "auto"};
  height: ${({ height }) => height || "auto"};
`;

const InfoEl = styled.div`
  background-color: #0003;
  border-radius: 24px;
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -ms-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  position: absolute;
  bottom: 0;
  right: 0;
  max-width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 30px;

  img {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    margin-right: 20px;
  }

  p {
    color: #fff;
    margin: 0;
    font-size: 12px;
  }
`;

const InfoTextWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 40px;
`;

const ImageSliderEl = styled(Slider)`
  margin-top: 120px;
  width: 340px;
  margin-left: 120px;
`;

const ImageWithInfo = props => {
  const { src, info, width, height, className } = props;
  return (
    <WrapperEl className={className} width={width} height={height}>
      <RoundedImage src={src} width="100%" height="100%" />
      {info && (
        <InfoEl className="info">
          <img src={infoIcon} alt="" />
          <InfoTextWrapper>{info}</InfoTextWrapper>
        </InfoEl>
      )}
    </WrapperEl>
  );
};

export const App = () => {
  const images = [
    {
      src: persephoneReturn,
      info: "**Художник:** Ф. Лейтон\n**Название:** «Возвращение Персефоны»\n"
    },
    {
      src: proserpineAbduction,
      info:
        "**Художник:** Ян Брейгель Старший\n**Название:** «Похищение Прозерпины»\n"
    }
  ];
  const imagesArray = images.map((image, index) => (
    <ImageWithInfo
      key={index}
      src={image.src}
      info={<Markdown>{image.info}</Markdown>}
    />
  ));
  return <ImageSliderEl imagesArray={imagesArray} />;
};
