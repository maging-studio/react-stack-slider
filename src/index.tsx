import React, { ReactNode, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import styles from "./styles.css";

interface IImageSliderProps {
  className?: string;
  imagesArray: ReactNode[];
}

type TDirection = 'forward' | 'back';

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
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isDragging, setDragging] = useState<boolean>(false);
  const [images, setImages] = useState<ReactNode[]>(imagesArray);
  const [activeDrags, setActiveDrags] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>(defaultPosition);

  const bounds = {
    top: -slideTrigger,
    bottom: slideTrigger,
    left: 0,
    right: 0,
  };

  const onStart = (e: DraggableEvent): void => {
    e.preventDefault();
    setActiveDrags(activeDrags + 1);
    const firstImage = images[0];
    const lastImage = images[images.length - 1];
    const newImagesArray = [lastImage, ...images, firstImage];
    setImages(newImagesArray);
  };

  const onStop = (e: DraggableEvent, data: DraggableData): void => {
    e.preventDefault();
    // setImages(images.slice(1, images.length - 1));
    setActiveDrags(activeDrags - 1);

    if (data.lastY === bounds.bottom) {
      // swapSlides('forward');
      setImages(images.slice(2, images.length));
      setPosition(defaultPosition);
    } else if (data.lastY === bounds.top) {
      // swapSlides('back');
      setImages(images.slice(0, images.length - 2));
      setPosition(defaultPosition);
    }
    else animatePositionTo(data.lastY, data.lastY < 0 ? 'forward' : 'back');
  };

  const onDrag = (_: any, data: DraggableData): void => {
    setDragging(true);
    setPosition({ x: data.x, y: data.y });
  };

  const handleClick = () => {
    if (isDragging) return setDragging(false);
    const newArray = [...images, images[0]];
    setImages(newArray);
    animatePositionTo(slideTrigger, "forward", true);
  };

  const swapSlides = (direction: TDirection = "forward", isClick: boolean = false) => {
    // const slicePart = isClick ? 0 : 1;
    const sliceStart = direction === 'forward' ? 1 : 0;
    const sliceEnd = images.length - (direction === 'back' ? 1 : 0);
    const newImagesArray = images.slice(sliceStart, sliceEnd);
    // console.log(sliceStart, sliceEnd);
    // const newImagesArray = images
    //   .slice(0, images.length - slicePart)
    //   .map((_, index) =>
    //     index === images.length - 1 ? images[0] : images[index + 1]
    //   );
    setImages(newImagesArray);
    setDragging(false);
  };

  const animatePositionTo = (
    endPosition: number,
    direction: TDirection = "forward",
    isClick: boolean = false
  ): void => {
    let timer = endPosition;
    const interval = setInterval(() => {
      timer = direction === "forward" ? timer + 3 : timer - 3;
      if (
        (direction === "forward" && timer < 0) ||
        (direction === "back" && timer > 0)
      ) {
        setPosition({ x: 0, y: timer });
        if (isClick) setDisabled(true);
      } else {
        setPosition(defaultPosition);
        if (isClick) {
          swapSlides(direction, isClick);
          setDisabled(false);
        }
        clearInterval(interval);
      }
    }, 10);
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
                  : index === imagesArray.length + 1
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
            onClick={handleClick}
            className={disabled ? styles["disable"] : ""}
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
