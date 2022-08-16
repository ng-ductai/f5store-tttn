import React, { useEffect, useState } from "react";
import { BarChartOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Bar } from "react-chartjs-2";
import statisticApi from "../../../apis/statisticApi";
import { formatProductPrice } from "../../../helpers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// tạo danh sách năm
const generateLabels = (
  startYear = new Date().getFullYear(),
  endYear = new Date().getFullYear()
) => {
  let result = [];
  for (let i = startYear; i <= endYear; ++i) {
    result.push(`${i}`);
  }
  return result;
};

const AnnualRevenue = () => {
  const startYear = new Date().getFullYear() - 6;
  const endYear = new Date().getFullYear();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("doanh thu", data);
  // thống kê
  useEffect(() => {
    let isSubscribe = true;
    const getStaAnnualRevenue = async () => {
      try {
        const response = await statisticApi.getStaAnnualRevenue(
          startYear,
          endYear
        );
        if (isSubscribe && response) {
          const data = response.data.data.reverse();
          setData(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) setIsLoading(false);
      }
    };
    getStaAnnualRevenue();
    return () => {
      isSubscribe = false;
    };
  }, [endYear, startYear]);

  return (
    <>
      {isLoading ? (
        <Spin
          tip="Đang thống kê ..."
          className="trans-center"
          indicator={<BarChartOutlined spin />}
        />
      ) : (
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          <Bar
            data={{
              labels: generateLabels(startYear, endYear),
              datasets: [
                {
                  backgroundColor: "#2EA62A",
                  data: [...data],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: `Doanh thu theo từng năm từ năm ${startYear} đến ${endYear}`,
                  font: { size: 16 },
                  color: "#3e95cd",
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: function (value, index, values) {
                      return value >= 1000000000
                        ? `${(value / 1000000000).toFixed(1)} tỷ`
                        : value >= 1000000
                        ? `${(value / 1000000).toFixed(0)} tr`
                        : formatProductPrice(value);
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </>
  );
};

export default AnnualRevenue;
