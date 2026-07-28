import React, { useEffect, useMemo, useRef, useState } from "react";
import NftCard from "../UI/NftCard";
import { items } from "../../data/marketplaceData";
import { fetchNewItems } from "../../data/marketplaceApi";

const getVisibleCardCount = () => {
  if (window.innerWidth < 768) {
    return 1;
  }

  if (window.innerWidth < 1200) {
    return 2;
  }

  return 3;
};

const NewItems = () => {
  const [apiItems, setApiItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const dragStartX = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadNewItems = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const loadedItems = await fetchNewItems();
        if (isMounted) {
          setApiItems(Array.isArray(loadedItems) ? loadedItems : []);
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
          setApiItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNewItems();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const syncVisibleCount = () => {
      setVisibleCount(getVisibleCardCount());
    };

    syncVisibleCount();
    window.addEventListener("resize", syncVisibleCount);

    return () => {
      window.removeEventListener("resize", syncVisibleCount);
    };
  }, []);

  const newestItems = useMemo(() => {
    if (isLoading) {
      return new Array(3).fill(0).map((_, index) => ({
        ...items[index % items.length],
        id: `loading-${index}`,
      }));
    }

    if (apiItems.length > 0) {
      return apiItems;
    }

    return items;
  }, [apiItems, isLoading]);

  const canSlide = newestItems.length > visibleCount;
  const slidesToShow = canSlide
    ? new Array(visibleCount).fill(null).map((_, index) => {
        const itemIndex = (startIndex + index) % newestItems.length;
        return newestItems[itemIndex];
      })
    : newestItems;

  const handlePrev = () => {
    if (!canSlide) {
      return;
    }

    setStartIndex((currentIndex) =>
      currentIndex === 0 ? newestItems.length - 1 : currentIndex - 1
    );
  };

  const handleNext = () => {
    if (!canSlide) {
      return;
    }

    setStartIndex((currentIndex) => (currentIndex + 1) % newestItems.length);
  };

  useEffect(() => {
    if (!canSlide || isAutoPaused) {
      return undefined;
    }

    const autoplayTimer = setInterval(() => {
      setStartIndex((currentIndex) => (currentIndex + 1) % newestItems.length);
    }, 3500);

    return () => {
      clearInterval(autoplayTimer);
    };
  }, [canSlide, isAutoPaused, newestItems.length]);

  const handleDragStart = (clientX) => {
    dragStartX.current = clientX;
  };

  const handleDragEnd = (clientX) => {
    if (dragStartX.current === null) {
      return;
    }

    const dragDistance = clientX - dragStartX.current;
    dragStartX.current = null;

    if (Math.abs(dragDistance) < 40) {
      return;
    }

    if (dragDistance > 0) {
      handlePrev();
      return;
    }

    handleNext();
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="home-carousel" style={{ "--visible-count": visibleCount }}>
              <button
                type="button"
                className="home-carousel-arrow home-carousel-arrow-left"
                onClick={handlePrev}
                aria-label="Previous new item"
              >
                <i className="fa fa-angle-left"></i>
              </button>
              <div
                className="home-carousel-window"
                onMouseEnter={() => setIsAutoPaused(true)}
                onMouseLeave={() => setIsAutoPaused(false)}
                onMouseDown={(event) => handleDragStart(event.clientX)}
                onMouseUp={(event) => handleDragEnd(event.clientX)}
                onTouchStart={(event) => handleDragStart(event.touches[0].clientX)}
                onTouchEnd={(event) => {
                  const touchPoint = event.changedTouches[0];
                  if (touchPoint) {
                    handleDragEnd(touchPoint.clientX);
                  }
                }}
              >
                <div className="home-carousel-track">
                  {slidesToShow.map((item, index) => (
                    <div className="home-carousel-slide" key={`${item.id}-${index}`}>
                      <NftCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="home-carousel-arrow home-carousel-arrow-right"
                onClick={handleNext}
                aria-label="Next new item"
              >
                <i className="fa fa-angle-right"></i>
              </button>
            </div>
          </div>
          {!isLoading && hasError ? (
            <div className="col-lg-12 text-center">
              <p>New items are temporarily unavailable.</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
