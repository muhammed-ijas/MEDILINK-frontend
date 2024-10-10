import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  BarController,
  BarElement,
  PieController,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getVerifiedServices, getUnVerifiedServices, getUsers } from "../../api/admin";

interface Service {
  _id: string;
  name: string;
  isVerified: boolean;
  serviceType: string; // hospital, clinic, ambulance, homeNurse
}

interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

// Register required components
Chart.register(
  BarController,
  BarElement,
  PieController,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const chartRefs = {
    verifiedServicesChart: useRef<HTMLCanvasElement | null>(null),
    blockedUsersChart: useRef<HTMLCanvasElement | null>(null),
    serviceTypesChart: useRef<HTMLCanvasElement | null>(null),
  };

  const [dataCounts, setDataCounts] = useState({
    verifiedServicesCount: 0,
    unverifiedServicesCount: 0,
    blockedUsersCount: 0,
    unblockedUsersCount: 0,
    hospitalCount: 0,
    clinicCount: 0,
    ambulanceCount: 0,
    homeNurseCount: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chartInstances = useRef<any[]>([]); // Ref to keep track of chart instances

  useEffect(() => {
    const fetchData = async () => {
      try {
        const verifiedServices = await getVerifiedServices();
        const unverifiedServices = await getUnVerifiedServices();
        const users = await getUsers();

        // Count blocked and unblocked users
        const blockedUsers = users.users.filter((user: User) => user.isBlocked).length;
        const unblockedUsers = users.users.filter((user: User) => !user.isBlocked).length;

        // Count service types
        const hospitalCount = verifiedServices.services.filter((service: Service) => service.serviceType === "hospital").length;
        const clinicCount = verifiedServices.services.filter((service: Service) => service.serviceType === "clinic").length;
        const ambulanceCount = verifiedServices.services.filter((service: Service) => service.serviceType === "ambulance").length;
        const homeNurseCount = verifiedServices.services.filter((service: Service) => service.serviceType === "homeNurse").length;

        // Update state with counts
        setDataCounts({
          verifiedServicesCount: verifiedServices.services.length,
          unverifiedServicesCount: unverifiedServices.services.length,
          blockedUsersCount: blockedUsers,
          unblockedUsersCount: unblockedUsers,
          hospitalCount,
          clinicCount,
          ambulanceCount,
          homeNurseCount,
        });
      } catch (err) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      renderCharts();
    }
  }, [loading, error, dataCounts]);

  const renderCharts = () => {
    // Cleanup previous chart instances
    chartInstances.current.forEach(chart => chart.destroy());

    // Create new charts and store instances
    chartInstances.current = [
      renderVerifiedServicesChart(),
      renderBlockedUsersChart(),
      renderServiceTypesChart(),
    ].filter(Boolean); // Filter out any null values
  };

  const renderVerifiedServicesChart = () => {
    if (chartRefs.verifiedServicesChart.current) {
      const chartData = {
        labels: ["Verified Services", "Unverified Services", "Users"],
        datasets: [
          {
            label: "Count",
            data: [
              dataCounts.verifiedServicesCount,
              dataCounts.unverifiedServicesCount,
              dataCounts.blockedUsersCount + dataCounts.unblockedUsersCount,
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
      return new Chart(chartRefs.verifiedServicesChart.current, {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "top" },
            title: { display: true, text: "Verified/Unverified Services & Users" },
          },
        },
      });
    }
    return null;
  };

  const renderBlockedUsersChart = () => {
    if (chartRefs.blockedUsersChart.current) {
      const chartData = {
        labels: ["Blocked Users", "Unblocked Users"],
        datasets: [
          {
            label: "Count",
            data: [dataCounts.blockedUsersCount, dataCounts.unblockedUsersCount],
            backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(75, 192, 192, 0.6)"],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
            borderWidth: 1,
          },
        ],
      };
      return new Chart(chartRefs.blockedUsersChart.current, {
        type: "pie",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "top" },
            title: { display: true, text: "Blocked vs Unblocked Users" },
          },
        },
      });
    }
    return null;
  };

  const renderServiceTypesChart = () => {
    if (chartRefs.serviceTypesChart.current) {
      const chartData = {
        labels: ["Hospital", "Clinic", "Ambulance", "Home Nurse"],
        datasets: [
          {
            label: "Count",
            data: [
              dataCounts.hospitalCount,
              dataCounts.clinicCount,
              dataCounts.ambulanceCount,
              dataCounts.homeNurseCount,
            ],
            backgroundColor: [
              "rgba(153, 102, 255, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
            borderColor: [
              "rgba(153, 102, 255, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
      return new Chart(chartRefs.serviceTypesChart.current, {
        type: "doughnut",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "top" },
            title: { display: true, text: "Service Types Count" },
          },
        },
      });
    }
    return null;
  };

  return (
    <div className="flex flex-wrap justify-around p-4">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="w-full sm:w-1/2 lg:w-1/2 h-96 p-2">
            <canvas ref={chartRefs.verifiedServicesChart} />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/2 h-96 p-2">
            <canvas ref={chartRefs.blockedUsersChart} />
          </div>
          <div className="w-full sm:w-full lg:w-1/2 h-96 p-2">
            <canvas ref={chartRefs.serviceTypesChart} />
          </div>
        </>
      )}
    </div>
  );
  
};

export default Dashboard;
