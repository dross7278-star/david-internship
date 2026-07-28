import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SubHeader from "../images/subheader.jpg";
import ExploreItems from "../components/explore/ExploreItems";

const CATEGORY_LABELS = {
  art: "Art",
  music: "Music",
  "domain-names": "Domain Names",
  "virtual-worlds": "Virtual Worlds",
  "trading-cards": "Trading Cards",
  collectibles: "Collectibles",
};

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = (searchParams.get("category") || "all").toLowerCase();
  const categoryLabel = CATEGORY_LABELS[selectedCategory] || "All Categories";

  const handleCategoryChange = (nextCategory) => {
    const normalizedCategory = String(nextCategory || "all").toLowerCase();

    if (normalizedCategory === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({ category: normalizedCategory });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="subheader"
          className="text-light"
          style={{ background: `url("${SubHeader}") top` }}
        >
          <div className="center-y relative text-center">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h1>Explore</h1>
                  <p className="lead mb-0">Category: {categoryLabel}</p>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <ExploreItems
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;
