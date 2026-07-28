import React from "react";
import NftCard from "../UI/NftCard";
import Skeleton from "../UI/Skeleton";

const AuthorItems = ({ items, isLoading = false }) => {
  const cardsToRender = isLoading ? new Array(8).fill(null) : items;

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {cardsToRender.map((item, index) => (
            <div
              className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
              key={isLoading ? `author-skeleton-${index}` : item.id}
              data-aos="fade-up"
              data-aos-delay={Math.min(index * 35, 210)}
            >
              {isLoading ? (
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
              ) : (
                <NftCard item={item} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
