import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const kernelDensityEstimator = (kernel, X) => (V) =>
    X.map(x => [x, d3.mean(V, v => kernel(x - v))]);

const kernelEpanechnikov = k => v =>
    Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;

const StatementVotesChart = ({ statements, width = 700, height = 80, fontSize = 18 }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!statements || statements.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 50, bottom: 20, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleLinear().domain([0, 5]).range([0, innerWidth]);
        const yScale = d3.scaleLinear().range([innerHeight, 0]);

        statements.forEach((statement, index) => {
            const group = svg
                .append("g")
                .attr("transform", `translate(${margin.left}, ${index * height})`);

            const votes = statement.votes;
            const avg = d3.mean(votes) || 0;

            const xTicks = xScale.ticks(100);
            const kde = kernelDensityEstimator(kernelEpanechnikov(0.4), xTicks);
            const density = kde(votes);

            yScale.domain([0, d3.max(density, (d) => d[1]) || 1]);

            // Area curve
            const area = d3.area()
                .x(d => xScale(d[0]))
                .y0(innerHeight)
                .y1(d => yScale(d[1]))
                .curve(d3.curveBasis);

            group.append("path")
                .datum(density)
                .attr("fill", statement.color || "steelblue")
                .attr("opacity", 0.2)
                .attr("d", area);

            // Baseline (gray)
            group.append("line")
                .attr("x1", 0)
                .attr("x2", innerWidth)
                .attr("y1", innerHeight)
                .attr("y2", innerHeight)
                .attr("stroke", "#ddd")
                .attr("stroke-width", 4);

            // Average baseline (colored)
            group.append("line")
                .attr("x1", 0)
                .attr("x2", xScale(avg))
                .attr("y1", innerHeight)
                .attr("y2", innerHeight)
                .attr("stroke", statement.color || "steelblue")
                .attr("stroke-width", 4)
                .attr("stroke-linecap", "round");

            // Average circle (ALWAYS visible)
            const avgGroup = group.append("g").attr("class", "avg-marker");
            avgGroup
                .append("circle")
                .attr("cx", xScale(avg))
                .attr("cy", innerHeight)
                .attr("r", 20)
                .attr("fill", statement.color || "steelblue");

            avgGroup
                .append("text")
                .attr("x", xScale(avg))
                .attr("y", innerHeight + fontSize / 3)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSize)
                .attr("fill", "white")
                .attr("font-weight", "bold")
                .text(avg.toFixed(1));

            // Labels
            group.append("text")
                .attr("x", 0)
                .attr("y", -5)
                .attr("fill", "#333")
                .attr("font-size", fontSize)
                .text(statement.label);

            group.append("text")
                .attr("x", innerWidth)
                .attr("y", -5)
                .attr("fill", "#333")
                .attr("font-size", fontSize - 2)
                .attr("text-anchor", "end")
                .text(`${statement.skips || 0} skips`);

            // Vote markers (only on hover)
            const votePoints = group
                .selectAll(".vote-point")
                .data(votes)
                .enter()
                .append("g")
                .attr("class", "vote-point")
                .style("opacity", 0);

            votePoints.append("circle")
                .attr("cx", d => xScale(d))
                .attr("cy", innerHeight)
                .attr("r", 14)
                .attr("fill", "white")
                .attr("stroke", statement.color || "steelblue")
                .attr("stroke-width", 2);

            votePoints.append("text")
                .attr("x", d => xScale(d))
                .attr("y", innerHeight + fontSize / 3)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSize - 2)
                .attr("fill", statement.color || "steelblue")
                .attr("font-weight", "bold")
                .text(d => d);

            group.append("rect")
                .attr("width", innerWidth)
                .attr("height", innerHeight)
                .attr("fill", "transparent")
                .on("mouseenter", () => votePoints.transition().duration(200).style("opacity", 1))
                .on("mouseleave", () => votePoints.transition().duration(200).style("opacity", 0));
        });
    }, [statements, width, height, fontSize]);

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height * statements.length}
            style={{ overflow: "visible" }}
        />
    );
};

export default StatementVotesChart;
