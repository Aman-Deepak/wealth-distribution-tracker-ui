// src/pages/portfolio/Portfolio.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import parse, { DOMNode, Element } from "html-react-parser";
import { chartsAPI, tablesAPI } from "../../services/api";
import { Card, CardHeader, CardBody } from "../../components/ui";
import { ChartResponse, TableResponse } from "../../types";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];

// Transform HTML tables to Tailwind-styled tables
// At top of file, update transformTable:
const transformTable = (node: DOMNode) => {
  if (node instanceof Element) {
    switch (node.name) {
      case "table":
        node.attribs = {
          ...node.attribs,
          className:
            "min-w-full divide-y divide-gray-200 table-auto border border-gray-200 dark:border-gray-700",
        };
        break;
      case "thead":
        node.attribs = { ...node.attribs, className: "bg-gray-50 dark:bg-gray-800" };
        break;
      case "tr":
        // add striped effect
        node.attribs = {
          ...node.attribs,
          className: (node.attribs.className || "") + " odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700",
        };
        break;
      case "th":
        node.attribs = {
          ...node.attribs,
          className:
            "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        };
        break;
      case "td":
        node.attribs = {
          ...node.attribs,
          className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100",
        };
        break;
      default:
        break;
    }
  }
};


const Portfolio: React.FC = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Expense"]);
  const [activeTab, setActiveTab] = useState("expense");

  // Fetch charts
  const { data: expensePie } = useQuery<ChartResponse>({
    queryKey: ["expensePie"],
    queryFn: () => chartsAPI.getChartData("expense_type_pie"),
  });
  const { data: savingsPies } = useQuery<any>({
    queryKey: ["savingsPies"],
    queryFn: () => chartsAPI.getChartData("savings_pie"),
  });
  const { data: monthlyTrends } = useQuery<ChartResponse>({
    queryKey: ["monthlyTrends"],
    queryFn: () => chartsAPI.getChartData("financial_monthly_trends"),
  });

  // Fetch tables
  const { data: expenseTable } = useQuery<TableResponse>({
    queryKey: ["expenseTable"],
    queryFn: () => tablesAPI.getTableData("expense_summary"),
  });
  const { data: savingsTable } = useQuery<TableResponse>({
    queryKey: ["savingsTable"],
    queryFn: () => tablesAPI.getTableData("savings_summary"),
  });
  const { data: yearlyDistTable } = useQuery<TableResponse>({
    queryKey: ["yearlyDistTable"],
    queryFn: () => tablesAPI.getTableData("yearly_distribution"),
  });

  const availableMetrics: string[] =
    monthlyTrends?.datasets?.map((d: any) => d.label) || [];

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const getDatasetData = (datasets: any, index = 0): number[] => {
    if (Array.isArray(datasets) && datasets[index]) {
      return datasets[index].data || [];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Portfolio Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive view of your financial portfolio
          </p>
        </div>

        {/* Pie Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader title="Expense Breakdown" />
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={
                      expensePie?.labels?.map((label, i) => ({
                        name: label,
                        value:
                          getDatasetData(expensePie.datasets, 0)[i] ?? 0,
                      })) || []
                    }
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {expensePie?.labels?.map((_, i) => (
                      <Cell
                        key={`cell-exp-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `₹${(v as number).toLocaleString()}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Portfolio Breakdown" />
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={
                      savingsPies?.portfolio_breakdown?.datasets?.[0]?.data?.map(
                        (value: number, i: number) => ({
                          name:
                            savingsPies.portfolio_breakdown.labels[i],
                          value,
                        })
                      ) || []
                    }
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {savingsPies?.portfolio_breakdown?.labels?.map(
                      (_: any, i: number) => (
                        <Cell
                          key={`cell-port-${i}`}
                          fill={COLORS[i % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `₹${(v as number).toLocaleString()}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Retirement Breakdown" />
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={
                      savingsPies?.retirement_breakdown?.datasets?.[0]?.data?.map(
                        (value: number, i: number) => ({
                          name:
                            savingsPies.retirement_breakdown.labels[i],
                          value,
                        })
                      ) || []
                    }
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {savingsPies?.retirement_breakdown?.labels?.map(
                      (_: any, i: number) => (
                        <Cell
                          key={`cell-ret-${i}`}
                          fill={COLORS[i % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `₹${(v as number).toLocaleString()}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Interactive Line Chart */}
        <Card>
          <CardHeader title="Financial Trends Analysis" />
          <CardBody>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Select metrics to display:
              </p>
              <div className="flex flex-wrap gap-2">
                {availableMetrics.map((metric) => (
                  <button
                    key={metric}
                    onClick={() => toggleMetric(metric)}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      selectedMetrics.includes(metric)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={
                  monthlyTrends?.labels?.map((lbl, i) => {
                    const entry: any = { month: lbl };
                    monthlyTrends.datasets?.forEach((d: any) => {
                      entry[d.label] = d.data[i] ?? 0;
                    });
                    return entry;
                  }) || []
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(v) => `₹${(v as number).toLocaleString()}`}
                />
                <Legend />
                {monthlyTrends?.datasets
                  ?.filter((d: any) => selectedMetrics.includes(d.label))
                  .map((d: any, idx: number) => (
                    <Line
                      key={d.label}
                      type="monotone"
                      dataKey={d.label}
                      stroke={COLORS[idx % COLORS.length]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Tabbed Tables */}
        <Card>
          <CardHeader title="Detailed Reports" />
          <CardBody>
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: "expense", name: "Expense Summary" },
                    { id: "savings", name: "Savings Summary" },
                    { id: "yearly", name: "Yearly Distribution" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="overflow-auto max-h-96">
              {activeTab === "expense" &&
        parse(expenseTable?.html || "", { replace: transformTable })}
      {activeTab === "savings" &&
        parse(savingsTable?.html || "", { replace: transformTable })}
      {activeTab === "yearly" &&
        parse(yearlyDistTable?.html || "", { replace: transformTable })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Portfolio;

