import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import statisticApi from "../../../apis/statisticApi";
import { formatProductPrice } from "../../../helpers";

const TotalRevenue = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("tổng doanh thu", data);
  // thống kê
  useEffect(() => {
    let isSubscribe = true;
    const getTotalRevenue = async () => {
      try {
        const response = await statisticApi.getTotalRevenue();
        if (isSubscribe && response) {
          const data = response.data.data;
          setData(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) setIsLoading(false);
      }
    };
    getTotalRevenue();
    return () => {
      isSubscribe = false;
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Spin tip="Đang thống kê ..." className="trans-center" />
      ) : (
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          <div className="total">
            <h2 className="total_title">Tổng doanh thu</h2>
            <h1 className="total_price"> {formatProductPrice(data)} </h1>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalRevenue;
