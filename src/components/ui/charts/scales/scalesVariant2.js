// "use client"
//
// import {useEffect, useMemo, useRef, useState} from "react"
// import * as d3 from "d3"
// import "./scalesVariant2.css"
//
// const TimelineVisualization = (props = {}) => {
//     const {
//         width = 600,
//         height,
//         fontSize = {
//             label: 16,
//             score: 14,
//             tick: 11,
//             voteCount: 12,
//             example: 12,
//         },
//         voteMax = 5,
//         voteMin = 0,
//         disableVoting = false,
//         disableAutoVoting = false,
//         showExampleText = true,
//         showVoteCounts = true,
//         showIndividualVotes = true,
//         autoVoteInterval = 3000,
//         data,
//         colors = {
//             primary: "#6366F1",
//             secondary: "#EF4444",
//             text: "#6B7280",
//             background: "#9CA3AF",
//         },
//         margins = {
//             top: 50,
//             right: 50,
//             bottom: 40,
//             left: 120,
//         },
//         onVoteAdded,
//     } = props
//
//     const svgRef = useRef(null)
//     const [lastUpdatedId, setLastUpdatedId] = useState(null)
//
//     const [statements, setStatements] = useState([])
//
//     const keyFromData = (arr) =>
//         Array.isArray(arr)
//             ? arr.map(s => `${s.id}:${s.votes?.length ?? 0}`).join("|")
//             : "";
//
// // ✅ NEW: мемо-ключ
//     const dataKey = useMemo(() => keyFromData(data), [data]);
//
// // ✅ NEW: единый эффект синхронизации
//     useEffect(() => {
//         if (!Array.isArray(data)) return; // не трогаем локальное состояние, если data нет
//         setStatements(
//             data.map(s => ({
//                 ...s,
//                 votes: Array.isArray(s.votes) ? s.votes : [],
//                 score: calculateScore(s.votes),
//             }))
//         );
//     }, [dataKey]);
//
//     const calculateScore = (votes) => {
//         if (votes.length === 0) return 0
//         const sum = votes.reduce((acc, v) => acc + v, 0)
//         return Math.round((sum / votes.length) * 10) / 10
//     }
//
//     const getVoteCountsAtEachPoint = (votes) => {
//         const counts = {}
//         votes.forEach((v) => (counts[v] = (counts[v] || 0) + 1))
//         return counts
//     }
//
//
//
//     const addRandomVote = () => {
//         if (disableVoting) return
//
//         setStatements((prev) => {
//             if (!prev.length) return prev
//             const idx = Math.floor(Math.random() * prev.length)
//             const randomVote = Math.floor(Math.random() * 6) // 0..5
//
//             return prev.map((s, i) => {
//                 if (i === idx) {
//                     const newVotes = [...s.votes, randomVote]
//                     const newScore = calculateScore(newVotes)
//                     setLastUpdatedId(s.id)
//                     onVoteAdded && onVoteAdded(s.id, randomVote)
//                     return { ...s, votes: newVotes, score: newScore }
//                 }
//                 return s
//             })
//         })
//     }
//
//     // Auto voting with stable interval (no statements in deps)
//     // useEffect(() => {
//     //     if (disableAutoVoting || disableVoting) return
//     //     const id = setInterval(() => {
//     //         setStatements((prev) => {
//     //             if (!prev.length) return prev
//     //             const idx = Math.floor(Math.random() * prev.length)
//     //             const randomVote = Math.floor(Math.random() * 6)
//     //             return prev.map((s, i) => {
//     //                 if (i === idx) {
//     //                     const newVotes = [...s.votes, randomVote]
//     //                     const newScore = calculateScore(newVotes)
//     //                     setLastUpdatedId(s.id)
//     //                     onVoteAdded && onVoteAdded(s.id, randomVote)
//     //                     return { ...s, votes: newVotes, score: newScore }
//     //                 }
//     //                 return s
//     //             })
//     //         })
//     //     }, autoVoteInterval)
//     //     return () => clearInterval(id)
//     // }, [disableAutoVoting, disableVoting, autoVoteInterval, onVoteAdded])
//
//     // D3 render/update
//     const prevDomainRef = useRef({ min: voteMin, max: voteMax, cw: null });
//
//
//     useEffect(() => {
//         if (!svgRef.current) return
//
//         const svg = d3.select(svgRef.current)
//         const margin = {
//             top: 0,
//             right: margins.right ?? 50,
//             bottom: 0,
//             left: margins.left ?? 120,
//         }
//         console.log(voteMax, voteMin)
//         const chartWidth = Math.max(0, (width ?? 600) - margin.left - margin.right);
//
//         const prev = prevDomainRef.current;
//         const domainChanged = prev.min !== voteMin || prev.max !== voteMax;
//         const widthChanged = prev.cw !== chartWidth;
//
//         if (domainChanged || widthChanged) {
//             d3.select(svgRef.current).selectAll("*").remove();
//         }
//
//         prevDomainRef.current = { min: voteMin, max: voteMax, cw: chartWidth };
//         // if (svg.selectAll("g").empty()) {
//         //     svg.selectAll("*").remove()
//         // }
//
//
//
//         // const chartWidth = (width ?? 600) - margin.left - margin.right
//
//         const chartHeight = height || statements.length * 100
//
//         svg.attr("width", width ?? 600).attr("height", chartHeight + margin.top + margin.bottom)
//
//
//
//         let g = svg.select("g.main-group")
//         if (g.empty()) {
//             g = svg.append("g").attr("class", "main-group").attr("transform", `translate(${margin.left},${margin.top})`)
//         }
//
//
//
//         const xScale = d3.scaleLinear().domain([voteMin, voteMax]).range([0, chartWidth])
//
//         statements.forEach((statement, index) => {
//
//             const y = index * 100 + 30
//             const s = Math.min(voteMax, Math.max(voteMin, statement.score ?? 0));
//
//             const scoreWidth = Math.max(0, xScale(s));
//             const isUpdated = statement.id === lastUpdatedId
//             const voteCounts = getVoteCountsAtEachPoint(statement.votes)
//
//             const statementGroup = g.select(`g.statement-${statement.id}`)
//
//             if (statementGroup.empty()) {
//                 const newGroup = g.append("g").attr("class", `statement-${statement.id}`)
//
//                 // Background bar
//                 newGroup
//                     .append("rect")
//                     .attr("class", "bg-bar")
//                     .attr("x", 0)
//                     .attr("y", y - 15)
//                     .attr("width", chartWidth)
//                     .attr("height", 30)
//                     .attr("fill", statement.color)
//                     .attr("opacity", 0.2)
//                     .attr("rx", 15)
//
//                 // Progress bar
//                 newGroup
//                     .append("rect")
//                     .attr("class", "progress-bar")
//                     .attr("x", 0)
//                     .attr("y", y - 10)
//                     .attr("width", scoreWidth)
//                     .attr("height", 20)
//                     .attr("fill", statement.color)
//                     .attr("rx", 10)
//
//                 // Score circle
//                 newGroup
//                     .append("circle")
//                     .attr("class", "score-circle")
//                     .attr("cx", scoreWidth)
//                     .attr("cy", y)
//                     .attr("r", 18)
//                     .attr("fill", statement.color)
//                     .attr("stroke", "white")
//                     .attr("stroke-width", 3)
//
//                 // Score text
//                 newGroup
//                     .append("text")
//                     .attr("class", "score-text")
//                     .attr("x", scoreWidth)
//                     .attr("y", y + 5)
//                     .attr("text-anchor", "middle")
//                     .attr("font-size", `${fontSize.score}px`)
//                     .attr("font-weight", "bold")
//                     .attr("fill", "white")
//                     .text(String(statement.score))
//
//                 // Label
//                 newGroup
//                     .append("text")
//                     .attr("class", "label")
//                     .attr("x", -10)
//                     .attr("y", y + 5)
//                     .attr("text-anchor", "end")
//                     .attr("font-size", `${fontSize.label}px`)
//                     .attr("font-weight", "500")
//                     .attr("fill", statement.color)
//                     .text(statement.label)
//
//                 // Votes near label
//                 if (showVoteCounts) {
//                     newGroup
//                         .append("text")
//                         .attr("class", "vote-count")
//                         .attr("x", -10)
//                         .attr("y", y - 20)
//                         .attr("text-anchor", "end")
//                         .attr("font-size", `${fontSize.voteCount}px`)
//                         .attr("font-weight", "400")
//                         .attr("fill", colors.text)
//                         .text(`${statement.votes.length} votes`)
//                 }
//                 // Axis ticks
//                 for (let tick = voteMin; tick <= voteMax; tick++) {
//                     const tickX = xScale(tick);
//
//                     newGroup
//                         .append("line")
//                         .attr("class", `tick-${tick}`)
//                         .attr("x1", tickX)
//                         .attr("x2", tickX)
//                         .attr("y1", y + 20)
//                         .attr("y2", y + 25)
//                         .attr("stroke", colors.background)
//                         .attr("stroke-width", 1);
//
//                     newGroup
//                         .append("text")
//                         .attr("class", `tick-label-${tick}`)
//                         .attr("x", tickX)
//                         .attr("y", y + 38)
//                         .attr("text-anchor", "middle")
//                         .attr("font-size", `${fontSize.tick}px`)
//                         .attr("fill", colors.text)
//                         .text(String(tick));
//                 }
//
//                 // Individual votes + stacked labels
//                 if (showIndividualVotes) {
//                     statement.votes.forEach((vote) => {
//                         const voteX = xScale(vote);
//                         newGroup.append("circle")
//                             .attr("class", "vote-point")
//                             .attr("cx", voteX)
//                             .attr("cy", y - 25)
//                             .attr("r", 4)
//                             .attr("fill", statement.color)
//                             .attr("opacity", 0.8)
//                             .attr("stroke", "white")
//                             .attr("stroke-width", 1);
//                     });
//
//                     Object.entries(voteCounts).forEach(([voteValue, count]) => {
//                         if (count > 1) {
//                             const voteX = xScale(Number(voteValue))
//                             newGroup
//                                 .append("text")
//                                 .attr("class", `vote-count-label-${voteValue}`)
//                                 .attr("x", voteX)
//                                 .attr("y", y - 35)
//                                 .attr("text-anchor", "middle")
//                                 .attr("font-size", "10px")
//                                 .attr("font-weight", "bold")
//                                 .attr("fill", statement.color)
//                                 .text(String(count))
//                         }
//                     })
//                 }
//             } else if (isUpdated) {
//                 // Redraw only dynamic pieces
//                 if (showIndividualVotes) {
//                     // statementGroup.selectAll("[class*='vote-point-']").remove()
//
//                     const pts = statementGroup.selectAll("circle.vote-point")
//                         .data(statement.votes, (d, i) => i);
//
//                     // UPDATE
//                     pts.transition()
//                         .duration(600)
//                         .ease(d3.easeCubicOut)
//                         .attr("cx", (d) => Math.max(0, xScale(d)));
//
//                     // ENTER
//                     pts.enter()
//                         .append("circle")
//                         .attr("class", "vote-point")
//                         .attr("cx", (d) => Math.max(0, xScale(d)))
//                         .attr("cy", y - 25)
//                         .attr("r", 0)
//                         .attr("fill", statement.color)
//                         .attr("opacity", 0.8)
//                         .attr("stroke", "white")
//                         .attr("stroke-width", 1)
//                         .transition().duration(600).ease(d3.easeElastic)
//                         .attr("r", 4);
//
//                     // EXIT
//                     pts.exit()
//                         .transition().duration(300)
//                         .attr("r", 0)
//                         .remove();
//
//                     statementGroup.selectAll("[class*='vote-count-label-']").remove()
//                     //
//                     // statement.votes.forEach((vote, voteIndex) => {
//                     //     const voteX = xScale(vote)
//                     //     const newPoint = statementGroup
//                     //         .append("circle")
//                     //         .attr("class", `vote-point-${voteIndex}`)
//                     //         .attr("cx", voteX)
//                     //         .attr("cy", y - 25)
//                     //         .attr("r", 0)
//                     //         .attr("fill", statement.color)
//                     //         .attr("opacity", 0.8)
//                     //         .attr("stroke", "white")
//                     //         .attr("stroke-width", 1)
//                     //
//                     //     if (voteIndex === statement.votes.length - 1) {
//                     //         newPoint.transition().duration(600).ease(d3.easeElastic).attr("r", 4)
//                     //     } else {
//                     //         newPoint.attr("r", 4)
//                     //     }
//                     // })
//
//
//                     statementGroup.selectAll("[class*='vote-count-label-']").remove()
//                     Object.entries(voteCounts).forEach(([voteValue, count]) => {
//                         if (count > 1) {
//                             const voteX = Math.max(0, xScale(Number(voteValue)));
//                             statementGroup.append("text")
//                                 .attr("class", `vote-count-label-${voteValue}`)
//                                 .attr("x", voteX)
//                                 .attr("y", y - 35)
//                                 .attr("text-anchor", "middle")
//                                 .attr("font-size", "10px")
//                                 .attr("font-weight", "bold")
//                                 .attr("fill", statement.color)
//                                 .attr("opacity", 0)
//                                 .text(String(count))
//                                 .transition().duration(300)
//                                 .attr("opacity", 1);
//                         }
//                     });
//                 }
//
//                 // Progress bar
//                 statementGroup.select(".progress-bar").transition().duration(800).ease(d3.easeElastic).attr("width", scoreWidth)
//
//                 // Score circle
//                 statementGroup.select(".score-circle").transition().duration(800).ease(d3.easeElastic).attr("cx", scoreWidth)
//
//                 // Score text
//                 statementGroup
//                     .select(".score-text")
//                     .transition()
//                     .duration(800)
//                     .ease(d3.easeElastic)
//                     .attr("x", scoreWidth)
//                     .text(String(statement.score))
//
//                 // Votes label
//                 if (showVoteCounts) {
//                     statementGroup
//                         .select(".vote-count")
//                         .transition()
//                         .duration(300)
//                         .attr("opacity", 0)
//                         .transition()
//                         .duration(300)
//                         .attr("opacity", 1)
//                         .text(`${statement.votes.length} votes`)
//                 }
//
//                 // Ripple effect
//                 statementGroup
//                     .append("circle")
//                     .attr("class", "ripple")
//                     .attr("cx", scoreWidth)
//                     .attr("cy", statementGroup.select(".score-circle").attr("cy"))
//                     .attr("r", 18)
//                     .attr("fill", "none")
//                     .attr("stroke", statement.color)
//                     .attr("stroke-width", 2)
//                     .attr("opacity", 0.6)
//                     .transition()
//                     .duration(1000)
//                     .ease(d3.easeCircleOut)
//                     .attr("r", 35)
//                     .attr("opacity", 0)
//                     .remove()
//             }
//         })
//
//         if (lastUpdatedId !== null) {
//             const t = setTimeout(() => setLastUpdatedId(null), 1000)
//             return () => clearTimeout(t)
//         }
//     }, [
//         statements,
//         lastUpdatedId,
//         width,
//         height,
//         fontSize,
//         showVoteCounts,
//         showIndividualVotes,
//         showExampleText,
//         colors,
//         margins,
//         voteMin,
//         voteMax
//     ])
//
//     return (
//         <div className="timeline-container">
//             <svg ref={svgRef} className="timeline-svg" />
//         </div>
//     )
// }
//
// export default TimelineVisualization
//
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

const StatementVotesChart = (props = {}) => {
    const {
        width = 600,
        height,
        fontSize = { label: 16, score: 14, tick: 11, voteCount: 12, example: 12 },
        voteMin = 0,
        voteMax = 5,
        showVoteCounts = true,
        showIndividualVotes = true,
        data = [],
        colors = {
            primary: "#6366F1",
            secondary: "#EF4444",
            text: "#6B7280",
            background: "#9CA3AF",
        },
        margins = { top: 0, right: 50, bottom: 0, left: 120 },
    } = props;

    const svgRef = useRef(null);

    // --- helpers ---
    const calculateScore = (votes = []) => {
        if (!votes.length) return 0;
        const sum = votes.reduce((a, v) => a + v, 0);
        return Math.round((sum / votes.length) * 10) / 10;
    };

    const getVoteCountsAtEachPoint = (votes = []) => {
        const counts = {};
        votes.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
        return counts;
    };

    const keyFromData = (arr) =>
        Array.isArray(arr) ? arr.map((s) => `${s.id}:${s.votes?.length ?? 0}`).join("|") : "";

    // --- local state synced with parent data (robust to in-place mutation) ---
    const dataKey = useMemo(() => keyFromData(data), [data]);
    const [statements, setStatements] = useState([]);

    useEffect(() => {
        if (!Array.isArray(data)) return;
        setStatements(
            data.map((s, i) => ({
                id: s.id ?? i,
                label: s.label ?? s.name ?? `Item ${i + 1}`,
                votes: Array.isArray(s.votes) ? s.votes : [],
                color: s.color ?? colors.primary,
                score: calculateScore(s.votes),
            }))
        );
    }, [dataKey]); // реагируем даже на мутации в месте (по длинам голосов)

    // --- geometry (вынесено наверх, чтобы избежать "before initialization") ---
    const mTop = margins?.top ?? 0;
    const mRight = margins?.right ?? 50;
    const mBottom = margins?.bottom ?? 0;
    const mLeft = margins?.left ?? 120;

    const outerWidth = width ?? 600;
    const chartWidthMemo = useMemo(
        () => Math.max(0, outerWidth - mLeft - mRight),
        [outerWidth, mLeft, mRight]
    );

    // --- чистим SVG только при смене домена/ширины ---
    const prevDomainRef = useRef({ min: voteMin, max: voteMax, cw: chartWidthMemo });
    useEffect(() => {
        if (!svgRef.current) return;
        const prev = prevDomainRef.current;
        const domainChanged = prev.min !== voteMin || prev.max !== voteMax;
        const widthChanged = prev.cw !== chartWidthMemo;

        if (domainChanged || widthChanged) {
            d3.select(svgRef.current).selectAll("*").remove();
        }
        prevDomainRef.current = { min: voteMin, max: voteMax, cw: chartWidthMemo };
    }, [voteMin, voteMax, chartWidthMemo]);

    // --- основной D3-рендер/апдейт (без полной очистки) ---
    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);

        const chartHeight = height || (statements.length ? statements.length * 100 : 60);
        svg.attr("width", outerWidth).attr("height", chartHeight + mTop + mBottom);

        let g = svg.select("g.main-group");
        if (g.empty()) {
            g = svg.append("g").attr("class", "main-group").attr("transform", `translate(${mLeft},${mTop})`);
        }

        const xScale = d3.scaleLinear().domain([voteMin, voteMax]).range([0, chartWidthMemo]);

        // ENTER + UPDATE по каждой строке
        statements.forEach((statement, index) => {
            const y = index * 100 + 30;
            const s = Math.min(voteMax, Math.max(voteMin, statement.score ?? 0));
            const scoreWidth = Math.max(0, xScale(s));

            let statementGroup = g.select(`g.statement-${statement.id}`);

            if (statementGroup.empty()) {
                // -------- ENTER --------
                const newGroup = g.append("g").attr("class", `statement-${statement.id}`);

                // фон
                newGroup
                    .append("rect")
                    .attr("class", "bg-bar")
                    .attr("x", 0)
                    .attr("y", y - 15)
                    .attr("width", chartWidthMemo)
                    .attr("height", 30)
                    .attr("fill", statement.color)
                    .attr("opacity", 0.2)
                    .attr("rx", 15);

                // прогресс
                newGroup
                    .append("rect")
                    .attr("class", "progress-bar")
                    .attr("x", 0)
                    .attr("y", y - 10)
                    .attr("width", scoreWidth)
                    .attr("height", 20)
                    .attr("fill", statement.color)
                    .attr("rx", 10);

                // кружок с текущим скором
                newGroup
                    .append("circle")
                    .attr("class", "score-circle")
                    .attr("cx", scoreWidth)
                    .attr("cy", y)
                    .attr("r", 18)
                    .attr("fill", statement.color)
                    .attr("stroke", "white")
                    .attr("stroke-width", 3);

                newGroup
                    .append("text")
                    .attr("class", "score-text")
                    .attr("x", scoreWidth)
                    .attr("y", y + 5)
                    .attr("text-anchor", "middle")
                    .attr("font-size", `${fontSize.score}px`)
                    .attr("font-weight", "bold")
                    .attr("fill", "white")
                    .text(String(statement.score));

                newGroup
                    .append("text")
                    .attr("class", "label")
                    .attr("x", -10)
                    .attr("y", y + 5)
                    .attr("text-anchor", "end")
                    .attr("font-size", `${fontSize.label}px`)
                    .attr("font-weight", "500")
                    .attr("fill", statement.color)
                    .text(statement.label);

                if (showVoteCounts) {
                    newGroup
                        .append("text")
                        .attr("class", "vote-count")
                        .attr("x", -10)
                        .attr("y", y - 20)
                        .attr("text-anchor", "end")
                        .attr("font-size", `${fontSize.voteCount}px`)
                        .attr("font-weight", "400")
                        .attr("fill", colors.text)
                        .text(`${statement.votes.length} votes`);
                }

                // осевые тики по динамическому диапазону
                for (let tick = voteMin; tick <= voteMax; tick++) {
                    const tickX = xScale(tick);
                    newGroup
                        .append("line")
                        .attr("class", `tick-${tick}`)
                        .attr("x1", tickX)
                        .attr("x2", tickX)
                        .attr("y1", y + 20)
                        .attr("y2", y + 25)
                        .attr("stroke", colors.background)
                        .attr("stroke-width", 1);

                    newGroup
                        .append("text")
                        .attr("class", `tick-label-${tick}`)
                        .attr("x", tickX)
                        .attr("y", y + 38)
                        .attr("text-anchor", "middle")
                        .attr("font-size", `${fontSize.tick}px`)
                        .attr("fill", colors.text)
                        .text(String(tick));
                }

                // точки голосов (ENTER)
                if (showIndividualVotes) {
                    newGroup
                        .selectAll("circle.vote-point")
                        .data(statement.votes, (_, i) => i)
                        .join((enter) =>
                            enter
                                .append("circle")
                                .attr("class", "vote-point")
                                .attr("cx", (d) => Math.max(0, xScale(d)))
                                .attr("cy", y - 25)
                                .attr("r", 4)
                                .attr("fill", statement.color)
                                .attr("opacity", 0.8)
                                .attr("stroke", "white")
                                .attr("stroke-width", 1)
                        );

                    const voteCounts = getVoteCountsAtEachPoint(statement.votes);
                    Object.entries(voteCounts).forEach(([voteValue, count]) => {
                        if (count > 1) {
                            const voteX = Math.max(0, xScale(Number(voteValue)));
                            newGroup
                                .append("text")
                                .attr("class", `vote-count-label-${voteValue}`)
                                .attr("x", voteX)
                                .attr("y", y - 35)
                                .attr("text-anchor", "middle")
                                .attr("font-size", "10px")
                                .attr("font-weight", "bold")
                                .attr("fill", statement.color)
                                .text(String(count));
                        }
                    });
                }
            } else {
                // -------- UPDATE (всегда) --------
                // бар/кружок/текст — плавно
                statementGroup
                    .select(".progress-bar")
                    .transition()
                    .duration(800)
                    .ease(d3.easeElastic)
                    .attr("width", scoreWidth);

                statementGroup
                    .select(".score-circle")
                    .transition()
                    .duration(800)
                    .ease(d3.easeElastic)
                    .attr("cx", scoreWidth);

                statementGroup
                    .select(".score-text")
                    .transition()
                    .duration(800)
                    .ease(d3.easeElastic)
                    .attr("x", scoreWidth)
                    .text(String(statement.score));

                if (showVoteCounts) {
                    statementGroup
                        .select(".vote-count")
                        .transition()
                        .duration(300)
                        .attr("opacity", 0)
                        .transition()
                        .duration(300)
                        .attr("opacity", 1)
                        .text(`${statement.votes.length} votes`);
                }

                // точки голосов через data join — плавный сдвиг
                if (showIndividualVotes) {
                    const pts = statementGroup
                        .selectAll("circle.vote-point")
                        .data(statement.votes, (d, i) => i);

                    // UPDATE: двигаем существующие
                    pts
                        .transition()
                        .duration(600)
                        .ease(d3.easeCubicOut)
                        .attr("cx", (d) => Math.max(0, xScale(d)));

                    // ENTER: новая точка появляется
                    pts
                        .enter()
                        .append("circle")
                        .attr("class", "vote-point")
                        .attr("cx", (d) => Math.max(0, xScale(d)))
                        .attr("cy", y - 25)
                        .attr("r", 0)
                        .attr("fill", statement.color)
                        .attr("opacity", 0.8)
                        .attr("stroke", "white")
                        .attr("stroke-width", 1)
                        .transition()
                        .duration(600)
                        .ease(d3.easeElastic)
                        .attr("r", 4);

                    // EXIT: если голосов стало меньше
                    pts
                        .exit()
                        .transition()
                        .duration(300)
                        .attr("r", 0)
                        .remove();

                    // пересобрать надписи накопленных голосов
                    statementGroup.selectAll("[class^='vote-count-label-']").remove();
                    const voteCounts = getVoteCountsAtEachPoint(statement.votes);
                    Object.entries(voteCounts).forEach(([voteValue, count]) => {
                        if (count > 1) {
                            const voteX = Math.max(0, xScale(Number(voteValue)));
                            statementGroup
                                .append("text")
                                .attr("class", `vote-count-label-${voteValue}`)
                                .attr("x", voteX)
                                .attr("y", y - 35)
                                .attr("text-anchor", "middle")
                                .attr("font-size", "10px")
                                .attr("font-weight", "bold")
                                .attr("fill", statement.color)
                                .attr("opacity", 0)
                                .text(String(count))
                                .transition()
                                .duration(300)
                                .attr("opacity", 1);
                        }
                    });
                }
            }
        });

        // Удаляем группы для строк, которых больше нет
        g.selectAll("g[class^='statement-']").each(function () {
            const cls = this.getAttribute("class"); // "statement-<id>"
            const id = Number(cls.split("-")[1]);
            if (!statements.some((s) => s.id === id)) d3.select(this).remove();
        });
    }, [
        statements,
        // geometry / scale
        outerWidth,
        height,
        chartWidthMemo,
        mLeft,
        mRight,
        mTop,
        mBottom,
        voteMin,
        voteMax,
        // visuals
        fontSize,
        showVoteCounts,
        showIndividualVotes,
        colors,
    ]);

    return <svg ref={svgRef} style={{ display: "block", width: "100%" }} />;
};

export default StatementVotesChart;
