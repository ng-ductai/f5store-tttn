import React, { useEffect, useState } from "react";
import { BarChartOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import statisticApi from "../../../apis/statisticApi";
import { formatProductPrice } from "../../../helpers";
import { Bar } from "react-chartjs-2";
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

// tạo danh sách tháng
const generateLabels = () => {
  let result = [];
  for (let i = 0; i < 12; ++i) {
    result.push(`T${i + 1}`);
  }
  return result;
};

const MonthlyRevenue = () => {
  // năm hiện tại
  const year = new Date().getFullYear();
  const [data, setData] = useState({ thisYear: [], lastYear: [] });
  const [isLoading, setIsLoading] = useState(true);

  // doanh thu
  useEffect(() => {
    let isSubScribe = true;
    const getStaMonthlyRevenue = async (year) => {
      try {
        setIsLoading(true);
        const response = await statisticApi.getStaMonthlyRevenue(year);
        if (isSubScribe && response) {
          const { thisYear, lastYear } = response.data;
          setData({ thisYear, lastYear });
          setIsLoading(false);
        }
      } catch (error) {
        setData({ thisYear: [], lastYear: [] });
        if (isSubScribe) setIsLoading(false);
      }
    };
    getStaMonthlyRevenue(year);
    return () => {
      isSubScribe = false;
    };
  }, [year]);

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
              labels: generateLabels(),
              datasets: [
                {
                  backgroundColor: "#2EA62A",
                  data: [...data.lastYear],
                  label: `Năm ${year - 1}`,
                },
                {
                  backgroundColor: "#4670FF",
                  data: [...data.thisYear],
                  label: `Năm ${year}`,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
                title: {
                  display: true,
                  text: `Doanh thu theo từng tháng của năm ${
                    year - 1
                  }, ${year}`,
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

export default MonthlyRevenue;
