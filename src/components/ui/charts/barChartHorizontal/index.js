import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import checkSvg from "assets/icons/check.svg";
import crossSvg from "assets/icons/times.svg";

const BarChartHorizontal = React.memo((props) => {
    const { data, textColor, isCreating, isCorrect } = props;

    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const [oldData, setOldData] = useState(data);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        // Extra left for category labels; right for value labels/icons
        const margin = { top: 20, right: 60, bottom: 30, left: 120 };

        setOldData(data);

        const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

        // SCALES (horizontal = value -> x, vertical = category -> y)
        const x = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value) || 0])
            .nice()
            .range([margin.left, width - margin.right]);

        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.id))
            .range([margin.top, height - margin.bottom])
            .padding(0.2);

        // Clear if length changed (avoid orphaned keyed nodes)
        if (data.length !== oldData.length) {
            svg.selectAll("*").remove();
        }

        // --- BARS ---
        const bars = svg.selectAll(".bar").data(data, (d) => d.id);

        bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", x(0))
            .attr("y", (d) => y(d.id))
            .attr("width", 0)
            .attr("height", y.bandwidth())
            .attr("rx", 6)
            .attr("ry", 6)
            .merge(bars)
            .attr("fill", (d) => d.color)
            .transition()
            .duration(800)
            .attr("x", x(0))
            .attr("width", (d) => Math.max(0, x(d.value) - x(0) + 5))
            .attr("y", (d) => y(d.id))
            .attr("height", y.bandwidth());

        bars.exit().remove();

        // --- VALUE LABELS ---
        const valueLabels = svg.selectAll(".bar-label").data(data, (d) => d.id);

        valueLabels
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", x(0))
            .attr("y", (d) => y(d.id) + y.bandwidth() / 2)
            .attr("text-anchor", "start")
            .attr("dy", "0.35em")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("fill", textColor || "black")
            .text((d) => `${d.value}%`)
            .merge(valueLabels)
            .style("fill", textColor || "black")
            .text((d) => `${d.value}%`)
            .transition()
            .duration(800)
            .attr("x", (d) => x(d.value) + 8)
            .attr("y", (d) => y(d.id) + y.bandwidth() / 2);

        valueLabels.exit().remove();

        // --- CORRECT/INCORRECT ICONS (optional) ---
        if (isCorrect) {
            const icons = svg.selectAll(".icon-label").data(data, (d) => d.id);

            icons
                .enter()
                .append("image")
                .attr("class", "icon-label")
                .attr("x", x(0))
                .attr("y", (d) => y(d.id) + (y.bandwidth() - 20) / 2)
                .attr("width", 20)
                .attr("height", 20)
                .merge(icons)
                .attr("href", (d) => (d.correct ? checkSvg : crossSvg))
                .transition()
                .duration(800)
                .attr("x", (d) => x(d.value) + 36)
                .attr("y", (d) => y(d.id) + (y.bandwidth() - 20) / 2);

            icons.exit().remove();
        } else {
            svg.selectAll(".icon-label").remove();
        }

        // --- CATEGORY NAMES (left side) ---
        const names = svg.selectAll(".bar-name").data(data, (d) => d.id);

        names
            .enter()
            .append("text")
            .attr("class", "bar-name")
            .attr("x", margin.left - 10)
            .attr("y", (d) => y(d.id) + y.bandwidth() / 2)
            .attr("text-anchor", "end")
            .attr("dy", "0.35em")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("fill", textColor || "black")
            .text((d) => d.name)
            .merge(names)
            .style("fill", textColor || "black")
            .text((d) => d.name)
            .attr("x", margin.left - 10)
            .transition()
            .duration(800)
            .attr("y", (d) => y(d.id) + y.bandwidth() / 2);

        names.exit().remove();

        // OPTIONAL: bottom value axis
        // const axis = d3.axisBottom(x).ticks(Math.min(6, width / 80)).tickFormat((d) => `${d}%`);
        // svg.selectAll(".x-axis").data([null]).join("g")
        //   .attr("class", "x-axis")
        //   .attr("transform", `translate(0,${height - margin.bottom})`)
        //   .call(axis);

    }, [data, textColor, isCorrect, oldData.length]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "45rem",
                overflow: "hidden",
                paddingBottom: "10px",
            }}
        >
            <svg ref={svgRef} />
        </div>
    );
});

export default BarChartHorizontal;
