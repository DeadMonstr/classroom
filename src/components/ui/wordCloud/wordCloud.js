import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const WordCloud = ({ words, orientation = "mixed" }) => {
    const svgRef = useRef();
    const previousPositions = useRef(new Map());

    useEffect(() => {
        if (!words || words.length === 0) return;

        const width = 800;
        const height = 500;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        let group = svg.select("g");
        if (group.empty()) {
            group = svg
                .append("g")
                .attr("transform", `translate(${width / 2},${height / 2})`);
        }

        // Dynamically reduce font size if many words
        const maxFont = Math.max(20, 100 - words.length / 3);
        const minFont = 8;
        const sizeScale = d3
            .scaleLinear()
            .domain([0, words.length - 1])
            .range([maxFont, minFont]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const rotationFn = () => {
            if (orientation === "horizontal") return 0;
            if (orientation === "vertical") return 90;
            return Math.random() > 0.5 ? 0 : 90;
        };

        const layout = cloud()
            .size([width, height])
            .words(
                words.map((d, i) => ({
                    text: d.word,
                    size: sizeScale(i),
                    id: `${d.word}_${i}`,
                }))
            )
            .padding(1)
            .spiral("rectangular")
            .rotate(rotationFn)
            .font("sans-serif")
            .fontSize((d) => d.size)
            .on("end", (data) => {
                const texts = group.selectAll("text").data(data, (d) => d.id);

                texts.exit().remove();

                texts
                    .transition()
                    .duration(800)
                    .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
                    .style("font-size", (d) => `${d.size}px`);

                const enterTexts = texts
                    .enter()
                    .append("text")
                    .attr("text-anchor", "middle")
                    .style("font-family", "sans-serif")
                    .style("fill", (d, i) => colorScale(i))
                    .style("font-size", (d) => `${d.size}px`)
                    .attr("transform", (d) => {
                        const prev = previousPositions.current.get(d.id);
                        return prev
                            ? `translate(${prev.x},${prev.y}) rotate(${prev.rotate})`
                            : `translate(0,0)`;
                    })
                    .text((d) => d.text);

                enterTexts
                    .transition()
                    .duration(800)
                    .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`);

                previousPositions.current.clear();
                data.forEach((d) => {
                    previousPositions.current.set(d.id, { x: d.x, y: d.y, rotate: d.rotate });
                });

                // === AUTO-ZOOM to fit ===
                const bounds = group.node().getBBox();
                const scale = Math.min(
                    width / bounds.width,
                    height / bounds.height,
                    1
                );

                group.attr(
                    "transform",
                    `translate(${width / 2},${height / 2}) scale(${scale})`
                );
            });

        layout.start();
    }, [words, orientation]);

    return <svg ref={svgRef}></svg>;
};

export default WordCloud;
