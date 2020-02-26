import React, { ReactNode, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import styles from "./styles.css";

interface IImageSliderProps {
  className?: string;
  imagesArray: ReactNode[];
}

const scaleFactor = 0.85;
const offset = 40;
const defaultPosition = { x: 0, y: 0 };
const slideTrigger = 80;

const getScale = (depth: number, position: number = 0): number => {
  const coefficient = (1 - scaleFactor) / slideTrigger;
  return (
    scaleFactor ** depth + position * coefficient * scaleFactor ** (depth - 1)
  );
};

const getZIndex = (depth: number, totalCount: number): number => {
  return totalCount - depth;
};

const getOffset = (depth: number, position: number): number => {
  const coefficient = offset / slideTrigger;
  return (
    offset * Math.sqrt(depth) -
    position * coefficient * (Math.sqrt(depth) - Math.sqrt(depth - 1))
  );
};

const getOpacity = (position: number = 0, reverse: boolean = false): number => {
  const coefficient = 1 / slideTrigger;
  return reverse ? position * coefficient : -coefficient * position + 1;
};

export const Slider = (props: IImageSliderProps) => {
  const { imagesArray, className } = props;
  const [images, setImages] = useState<ReactNode[]>(imagesArray);
  const [activeDrags, setActiveDrags] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>(
    defaultPosition
  );

  const bounds = { top: 0, left: 0, right: 0, bottom: slideTrigger };

  const onStart = (e: DraggableEvent): void => {
    e.preventDefault();
    // TS запрещает использовать ++activeDrags
    setActiveDrags(activeDrags + 1);
    const firstImage = images[0];
    const newImagesArray = [...images, firstImage];
    setImages(newImagesArray);
  };

  const onStop = (e: DraggableEvent, data: DraggableData): void => {
    e.preventDefault();
    setImages(images.slice(0, images.length - 1));
    if (data.lastY === slideTrigger) {
      setActiveDrags(activeDrags - 1);
      const firstImage = images[0];
      const newImagesArray = images
        .slice(0, images.length - 1)
        .map((_, index) =>
          index === images.length - 1 ? firstImage : images[index + 1]
        );
      setImages(newImagesArray);
    }
    setPosition(defaultPosition);
  };

  const onDrag = (_: any, data: DraggableData): void => {
    setPosition({ x: data.x, y: data.y });
  };

  const dragHandlers = {
    onStart: onStart,
    onStop: onStop,
    onDrag: onDrag,
    position: position,
    bounds: bounds
  };

  return (
    <div className={[styles["wrapper"], className].join(" ")}>
      {images.map((item, index) => {
        const itemWrapper = (
          <div
            className={styles["item-wrapper"]}
            key={index}
            style={{
              transform: `scale(${getScale(
                index,
                position.y
              )}) translateY(${-getOffset(index, position.y)}px)`,
              zIndex: getZIndex(index, imagesArray.length),
              opacity:
                index === 0
                  ? getOpacity(position.y)
                  : index === imagesArray.length
                  ? getOpacity(position.y, true)
                  : 1
            }}
          >
            {item}
          </div>
        );
        return index === 0 ? (
          <div
            style={{
              transform: `scale(${getScale(index, position.y)})`,
              zIndex: 2000,
              position: "relative"
            }}
            key={0}
          >
            <Draggable
              scale={getScale(index, position.y)}
              defaultPosition={{ x: 0, y: 0 }}
              axis="y"
              {...dragHandlers}
            >
              {itemWrapper}
            </Draggable>
          </div>
        ) : (
          itemWrapper
        );
      })}
    </div>
  );
};
