// Import necessary modules and components
import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../context/globalContext";
import { select, pie, arc, scaleOrdinal, schemeCategory10 } from "d3";
import { InnerLayout } from "../../styles/Layouts";
import "./Visualization.scss";


const Visualization = () => {
  // Destructure incomes and expenses from global context
  const { incomes, expenses } = useGlobalContext();
  // Set state for selected date
  const [selectedDate, setSelectedDate] = useState("");
  // Create refs for SVG elements
  const svgIncomeRef = useRef();
  const svgExpenseRef = useRef();

  // const handleDateChange = (e) => {
  //   setSelectedDate(e.target.value);
  // };

  const handleDateChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setSelectedDate(`${year}-${month}`);
  };

// Reset selectedDate to an empty string
  const resetDate = () => {
    setSelectedDate("");
  };

  // Update pie charts when incomes, expenses or selectedDate change
  useEffect(() => {

    if (!incomes || !expenses) return;

// Filter incomes and expenses based on the selected date
  const filteredIncomes = selectedDate
    ? incomes.filter(
        (income) => income.date.slice(0, 7) === selectedDate
      )
    : incomes;
  const filteredExpenses = selectedDate
    ? expenses.filter(
        (expense) => expense.date.slice(0, 7) === selectedDate
      )
    : expenses;

    console.log('Selected Date:', selectedDate);
    console.log('Filtered Incomes:', filteredIncomes);
    console.log('Filtered Expenses:', filteredExpenses);
  
    // Group incomes and expenses by category
    const incomeData = filteredIncomes.reduce((acc, income) => {
      const category = income.category;
      const amount = income.amount;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});
  
    const expenseData = filteredExpenses.reduce((acc, expense) => {
      const category = expense.category;
      const amount = expense.amount;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});
  
    // Convert data to a format suitable for pie charts
    const visualizationDataIncome = Object.entries(incomeData).map(([label, value]) => ({ label, value }));
    const visualizationDataExpense = Object.entries(expenseData).map(([label, value]) => ({ label, value }));

    // Clear an SVG element
    const clearSvg = (svgRef) => {
      const svg = select(svgRef.current);
      svg.selectAll("*").remove();
    };

    // Create pie charts for income and expense data
    const createPieChart = (svgRef, visualizationData, chartTitle) => {
      clearSvg(svgRef);

      if (visualizationData.length === 0) {
        const svg = select(svgRef.current)
          .attr("width", 400)
          .attr("height", 400);
      
        svg.append("text")
          .attr("x", 200)
          .attr("y", 200)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("font-weight", "bold")
          .text("No data available for the selected date");
      
        return;
      }

      const width = 400;
      const height = 400;
      const margin = 50;

      const radius = Math.min(width, height) / 2 - margin;

      const svg = select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(chartTitle);

      const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2 + 20})`);

      // const d3Pie = pie().value((d) => d.value);
      const d3Pie = pie().value((d) => d.value).sort(null);

      const d3Arc = arc()
        .innerRadius(0)
        .outerRadius(radius);

      const colorScale = scaleOrdinal(schemeCategory10);

      g.selectAll("path")
        .data(d3Pie(visualizationData))
        .enter()
        .append("path")
        .attr("d", d3Arc)
        .attr("fill", (d, i) => colorScale(i));

        g.selectAll("text")
        .data(d3Pie(visualizationData))
        .enter()
        .append("text")
        .each(function (d) {
          const centroid = d3Arc.centroid(d);
          const xPos = centroid[0];
          const yPos = centroid[1];
          const text = select(this)
            .attr("x", xPos)
            .attr("y", yPos)
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("font-size", "12px");
    
          const tspanY = d3Arc.centroid(d)[1] + 15;
          text.append("tspan")
            .attr("x", xPos)
            .attr("y", tspanY)
            .text(d.data.label)
            .style("font-weight", "bold");
    
          text.append("tspan")
            .attr("x", xPos)
            .attr("y", tspanY + 15)
            .text(`${((d.data.value / d3Pie(visualizationData).reduce((acc, d) => acc + d.data.value, 0)) * 100).toFixed(2)}%`);
          });
           // Add a legend
      const legend = svg
      .append("g")
      .attr("transform", `translate(${width - margin}, ${height - margin})`);

      const legendItemSize = 15;
      const legendSpacing = 5;

      visualizationData.forEach((data, i) => {
        const legendItem = legend.append("g").attr("transform", `translate(0, ${i * (legendItemSize + legendSpacing)})`);

        legendItem
          .append("rect")
          .attr("width", legendItemSize)
          .attr("height", legendItemSize)
          .style("fill", colorScale(i))
          .style("stroke", colorScale(i));

        legendItem
          .append("text")
          .attr("x", legendItemSize + legendSpacing)
          .attr("y", legendItemSize - legendSpacing)
          .text(data.label)
          .style("font-size", "12px");
        });
    };
    // Call createPieChart for both income and expense data
      createPieChart(svgIncomeRef, visualizationDataIncome, "Income by Category");
      createPieChart(svgExpenseRef, visualizationDataExpense, "Expense by Category");
  
    }, [incomes, expenses, selectedDate]);
    return (

      <div className="visualization-main">
       <InnerLayout>
        <h1>INCOME AND EXPENSE VISUALIZATION</h1>
        <label className="date-picker-label">
          {/* Select Date:
          <input type="date" value={selectedDate} onChange={handleDateChange} />
          <button className="reset-date-btn" onClick={resetDate}>Reset</button> */}
          Select Month:
          <input type="month" value={selectedDate} onChange={handleDateChange} />
          <button className="reset-date-btn" onClick={resetDate}>Reset</button>
        </label>
        <div className="visualization-charts">
          <svg ref={svgIncomeRef}></svg>
          <svg ref={svgExpenseRef}></svg>
        </div>
      </InnerLayout>
      </div>
    );
  };
  
  // Export Visualization component
  export default Visualization;
