import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildTopSellers, fetchTopSellers } from "../../data/marketplaceApi";
import Skeleton from "../UI/Skeleton";

const TopSellers = () => {
  const [apiSellers, setApiSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTopSellers = async () => {
      setIsLoading(true);

      try {
        const loadedSellers = await fetchTopSellers();
        if (isMounted) {
          setApiSellers(loadedSellers);
        }
      } catch (error) {
        if (isMounted) {
          setApiSellers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTopSellers();

    return () => {
      isMounted = false;
    };
  }, []);

  const sellers = buildTopSellers(apiSellers);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Authors</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {isLoading
                ? new Array(8).fill(0).map((_, index) => (
                    <li key={`seller-skeleton-${index}`}>
                      <div className="author_list_pp">
                        <Skeleton width="50px" height="50px" borderRadius="50%" />
                      </div>
                      <div className="author_list_info">
                        <Skeleton width="170px" height="24px" borderRadius="8px" />
                        <Skeleton width="120px" height="18px" borderRadius="8px" />
                      </div>
                    </li>
                  ))
                : sellers.map((seller, index) => (
                    <li key={seller.id} data-aos="fade-up" data-aos-delay={Math.min(index * 40, 240)}>
                      <div className="author_list_pp">
                        <Link to={`/author/${seller.id}`}>
                          <img className="lazy pp-author" src={seller.image} alt={seller.name} />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${seller.id}`}>{seller.name}</Link>
                        <span>
                          {typeof seller.price === "number"
                            ? `${seller.price.toFixed(1)} ETH`
                            : `${seller.followers} followers`}
                        </span>
                      </div>
                    </li>
                  ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
