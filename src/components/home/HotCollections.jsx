import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import { fetchHotCollections } from "../../data/marketplaceApi";

const getVisibleCardCount = () => {
  if (window.innerWidth < 768) {
    return 1;
  }

  if (window.innerWidth < 1200) {
    return 2;
  }

  return 3;
};

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const dragStartX = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCollections = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const data = await fetchHotCollections();
        if (isMounted) {
          setCollections(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
          setCollections([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCollections();

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

  const cardsToRender = isLoading ? new Array(3).fill({}) : collections;
  const canSlide = cardsToRender.length > visibleCount;
  const slidesToShow = canSlide
    ? new Array(visibleCount).fill(null).map((_, index) => {
        const itemIndex = (startIndex + index) % cardsToRender.length;
        return cardsToRender[itemIndex];
      })
    : cardsToRender;

  const handlePrev = () => {
    if (!canSlide) {
      return;
    }

    setStartIndex((currentIndex) =>
      currentIndex === 0 ? cardsToRender.length - 1 : currentIndex - 1
    );
  };

  const handleNext = () => {
    if (!canSlide) {
      return;
    }

    setStartIndex((currentIndex) => (currentIndex + 1) % cardsToRender.length);
  };

  useEffect(() => {
    if (!canSlide || isAutoPaused) {
      return undefined;
    }

    const autoplayTimer = setInterval(() => {
      setStartIndex((currentIndex) => (currentIndex + 1) % cardsToRender.length);
    }, 3500);

    return () => {
      clearInterval(autoplayTimer);
    };
  }, [canSlide, cardsToRender.length, isAutoPaused]);

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
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="home-carousel" style={{ "--visible-count": visibleCount }}>
              <button
                type="button"
                className="home-carousel-arrow home-carousel-arrow-left"
                onClick={handlePrev}
                aria-label="Previous hot collection"
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
                    <div className="home-carousel-slide" key={isLoading ? `loading-${index}` : item.id}>
                      <div className="nft_coll">
                        <div className="nft_wrap">
                          <Link to={isLoading ? "/item-details" : `/item-details/${item.id}`}>
                            <img
                              src={isLoading ? nftImage : item.nftImage || nftImage}
                              className="lazy img-fluid"
                              alt={isLoading ? "Loading collection" : item.title || "Collection"}
                            />
                          </Link>
                        </div>
                        <div className="nft_coll_pp">
                          <Link to={isLoading ? "/author" : `/author/${item.ownerId}`}>
                            <img
                              className="lazy pp-coll"
                              src={isLoading ? AuthorImage : item.authorImage || AuthorImage}
                              alt={isLoading ? "Loading author" : item.title || "Author"}
                            />
                          </Link>
                          <i className="fa fa-check"></i>
                        </div>
                        <div className="nft_coll_info">
                          <Link to={isLoading ? "/explore" : `/item-details/${item.id}`}>
                            <h4>{isLoading ? "Loading..." : item.title || "Untitled Collection"}</h4>
                          </Link>
                          <span>{isLoading ? "" : `ERC-${item.code ?? "N/A"}`}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="home-carousel-arrow home-carousel-arrow-right"
                onClick={handleNext}
                aria-label="Next hot collection"
              >
                <i className="fa fa-angle-right"></i>
              </button>
            </div>
          </div>
          {!isLoading && hasError && (
            <div className="col-lg-12 text-center">
              <p>Hot collections are temporarily unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
