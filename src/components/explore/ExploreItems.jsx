import React, { useEffect, useMemo, useState } from "react";
import NftCard from "../UI/NftCard";
import { buildExploreItems, fetchExploreItems } from "../../data/marketplaceApi";
import Skeleton from "../UI/Skeleton";

const ExploreItems = ({ selectedCategory = "all", onCategoryChange }) => {
  const [sortOrder, setSortOrder] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [apiItems, setApiItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory]);

  useEffect(() => {
    let isMounted = true;

    const loadExploreItems = async () => {
      setIsLoading(true);

      try {
        const loadedItems = await fetchExploreItems(sortOrder);
        if (isMounted) {
          setApiItems(loadedItems);
        }
      } catch (error) {
        if (isMounted) {
          setApiItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadExploreItems();

    return () => {
      isMounted = false;
    };
  }, [sortOrder]);

  const sortedItems = useMemo(
    () => buildExploreItems(apiItems, sortOrder),
    [apiItems, sortOrder]
  );

  const filteredItems = useMemo(() => {
    if (!selectedCategory || selectedCategory === "all") {
      return sortedItems;
    }

    return sortedItems.filter((item) => {
      const itemCategory = String(item.category || "art").toLowerCase();
      return itemCategory === selectedCategory;
    });
  }, [selectedCategory, sortedItems]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMoreItems = visibleCount < filteredItems.length;

  return (
    <>
      <div className="col-lg-12 d-flex flex-wrap gap-2 mb-4">
        <select
          id="filter-category"
          value={selectedCategory}
          onChange={(event) => {
            if (typeof onCategoryChange === "function") {
              onCategoryChange(event.target.value);
            }
          }}
        >
          <option value="all">All categories</option>
          <option value="art">Art</option>
          <option value="music">Music</option>
          <option value="domain-names">Domain Names</option>
          <option value="virtual-worlds">Virtual Worlds</option>
          <option value="trading-cards">Trading Cards</option>
          <option value="collectibles">Collectibles</option>
        </select>
        <select
          id="filter-items"
          value={sortOrder}
          onChange={(event) => {
            setSortOrder(event.target.value);
            setVisibleCount(8);
          }}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      {isLoading
        ? new Array(visibleCount).fill(0).map((_, index) => (
            <div
              key={`explore-skeleton-${index}`}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Skeleton width="50px" height="50px" borderRadius="50%" />
                </div>
                <div className="nft__item_wrap">
                  <Skeleton width="100%" height="220px" borderRadius="10px" />
                </div>
                <div className="nft__item_info">
                  <Skeleton width="68%" height="28px" borderRadius="8px" />
                  <Skeleton width="44%" height="20px" borderRadius="8px" />
                </div>
              </div>
            </div>
          ))
        : visibleItems.map((item) => (
            <div
              key={item.id}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              data-aos="fade-up"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <NftCard item={item} />
            </div>
          ))}
      {!isLoading && hasMoreItems ? (
        <div className="col-md-12 text-center">
          <button
            type="button"
            id="loadmore"
            className="btn-main lead"
            onClick={() => setVisibleCount((count) => count + 4)}
          >
            Load more
          </button>
        </div>
      ) : null}
    </>
  );
};

export default ExploreItems;
