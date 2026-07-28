import React, { useEffect, useMemo, useState } from "react";
import NftCard from "../UI/NftCard";
import { buildExploreItems, fetchExploreItems } from "../../data/marketplaceApi";

const ExploreItems = ({ selectedCategory = "all", onCategoryChange }) => {
  const [sortOrder, setSortOrder] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [apiItems, setApiItems] = useState([]);

  useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory]);

  useEffect(() => {
    let isMounted = true;

    const loadExploreItems = async () => {
      try {
        const loadedItems = await fetchExploreItems(sortOrder);
        if (isMounted) {
          setApiItems(loadedItems);
        }
      } catch (error) {
        if (isMounted) {
          setApiItems([]);
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
      {visibleItems.map((item) => (
        <div
          key={item.id}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          data-aos="fade-up"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <NftCard item={item} />
        </div>
      ))}
      {hasMoreItems ? (
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
