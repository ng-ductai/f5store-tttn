import React, { useEffect, useState } from "react";
import { PieChartOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import statisticApi from "../../../apis/statisticApi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
const TopOrders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState({ province: [], count: [] });

  // thống kê
  useEffect(() => {
    let isSubscribe = true;
    const getTopProvinceOrder = async () => {
      try {
        const response = await statisticApi.getTopProvinceOrder();
        if (isSubscribe && response) {
          const { data } = response.data;
          setList({
            province: [...data.map((item) => item.province)],
            count: [...data.map((item) => item.count)],
          });
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) setIsLoading(false);
      }
    };
    getTopProvinceOrder();
    return () => {
      isSubscribe = false;
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Spin
          tip="Đang thống kê ..."
          className="trans-center"
          indicator={<PieChartOutlined spin />}
        />
      ) : (
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          <Doughnut
            className="doughnutSize"
            data={{
              labels: [...list.province],
              datasets: [
                {
                  backgroundColor: [
                    "#3e95cd",
                    "#3cba9f",
                    "#8e5ea2",
                    "#cccccc",
                    "#e8c3b9",
                  ],
                  data: [...list.count],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: { display: true },
                title: {
                  display: true,
                  text: `Các tỉnh có đơn hàng nhiều nhất`,
                  font: { size: 16 },
                  color: "#3e95cd",
                },
              },
            }}
          />
        </div>
      )}
    </>
  );
};

export default TopOrders;
