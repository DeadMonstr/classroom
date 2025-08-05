import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import checkSvg from "assets/icons/check.svg";
import crossSvg from "assets/icons/times.svg";


const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

const BarChart = React.memo( (props) => {


    const {data, textColor,isCreating,isCorrect} = props


    const containerRef = useRef();
    const svgRef = useRef();
    const [oldData,setOldData] = React.useState(data)

    useEffect(() => {
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 40, right: 20, bottom: 40, left: 20 };
        setOldData(data)

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        // SCALES
        const x = d3.scaleBand()
            .domain(data.map((d) => d.id))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .nice()
            .range([height - margin.bottom, margin.top]);




        if (data.length !== oldData.length) {
            svg.selectAll("*").remove();
        }




        // --- BARS ---
        const bars = svg.selectAll(".bar")
            .data(data, (d, i) => d.id);


        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d, index) => x(d.id) )
            .attr("y", height - margin.bottom)
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("rx", 6)
            .merge(bars)
            .attr("fill", (d) => d.color)
            .transition()
            .duration(800)
            .attr("y", (d) => y(d.value))
            .attr("height", (d) => y(0) - y(d.value));

        bars.exit().remove();



        // --- LABEL + ICON ABOVE BAR ---
        const label = svg.selectAll(".bar-label")
            .data(data, (d, i) => d.id);
        label.enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", (d) => x(d.id))
            .attr("y",  height - margin.bottom)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .merge(label)
            .style("fill", textColor || "black")
            .text((d) => `${d.value}%`)
            .transition()
            .duration(800)
            .attr("y",  (d) => y(d.value) - 10)

        label.exit().remove();


        if (isCorrect) {
            const icon = svg.selectAll(".icon-label")
                .data(data, (d, i) => d.id);


            icon.enter()
                .append("image")
                .attr("class", "icon-label")
                .attr("x", (d) => x(d.id) + x.bandwidth() - 30)
                .attr("y", height - margin.bottom)
                .attr("width", 50)
                .attr("height", 50)
                .merge(icon)
                .attr("href", (d) => (d.correct ? checkSvg : crossSvg))
                .transition()
                .duration(800)
                .attr("y",(d) => y(d.value) - 30)

            icon.exit().remove();
        }




        // --- NAMES (Bottom) ---
        const names = svg.selectAll(".bar-name")
            .data(data, (d, i) => d.id);

        names.enter()
            .append("text")
            .attr("class", "bar-name")
            .attr("x", (d) => x(d.id) )
            .attr("y", height - 10)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .merge(names)
            .style("fill", textColor ||  "black")
            .text((d) => d.name);

        names.exit().remove();


//         const bars = svg.selectAll(".bar")
//             .data(data, d => d.id || d.name); // Use unique key
//
// // ENTER
//         const barsEnter = bars.enter()
//             .append("rect")
//             .attr("class", "bar")
//             .attr("x", d => x(d.name))
//             .attr("y", height - margin.bottom)
//             .attr("width", x.bandwidth())
//             .attr("height", 0)
//             .attr("fill", d => d.color)
//             .attr("rx", 6);
//
// // UPDATE + ENTER MERGE
//         barsEnter.merge(bars)
//             .transition()
//             .duration(800)
//             .attr("x", d => x(d.name))
//             .attr("y", d => y(d.value))
//             .attr("height", d => y(0) - y(d.value));
//
// // EXIT
//         bars.exit().remove();
//         // --- LABELS ---
//         const label = svg.selectAll(".bar-label")
//             .data(data, (d, i) => `${d.name}-${i}`);
//
//         label.enter()
//             .append("text")
//             .attr("class", "bar-label")
//             .attr("x", (d) => x(d.name))
//             .attr("y", height - margin.bottom)
//             .attr("text-anchor", "start")
//             .style("font-size", "16px")
//             .style("font-weight", "bold")
//             .merge(label)
//             .style("fill", textColor || "black")
//             .text((d) => `${d.value}%`)
//             .transition()
//             .duration(800)
//             .attr("y", (d) => y(d.value) - 10);
//
//         label.exit().remove();
//
//         // --- ICON ---
//         const icon = svg.selectAll(".icon-label")
//             .data(data, (d, i) => `${d.name}-${i}`);
//
//         icon.enter()
//             .append("image")
//             .attr("class", "icon-label")
//             .attr("x", (d) => x(d.name) + x.bandwidth() - 30)
//             .attr("y", height - margin.bottom)
//             .attr("width", 20)
//             .attr("height", 20)
//             .merge(icon)
//             .attr("href", (d) => (d.value >= 70 ? checkSvg : crossSvg))
//             .transition()
//             .duration(800)
//             .attr("y", (d) => y(d.value) - 30);
//
//         icon.exit().remove();
//
//         // --- NAMES ---
//         const names = svg.selectAll(".bar-name")
//             .data(data, (d, i) => `${d.name}-${i}`);
//
//         names.enter()
//             .append("text")
//             .attr("class", "bar-name")
//             .attr("x", (d) => x(d.name))
//             .attr("y", height - 10)
//             .attr("text-anchor", "start")
//             .style("font-size", "16px")
//             .style("font-weight", "bold")
//             .merge(names)
//             .style("fill", textColor || "black")
//             .text((d) => d.name);
//
//         names.exit().remove();
    }, [data]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "30rem",
                overflow: "hidden",
                paddingBottom: "10px",
            }}
        >
            <svg ref={svgRef}></svg>
        </div>
    );
});

export default BarChart;
