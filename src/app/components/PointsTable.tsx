"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./PointsTable.css";

interface TeamData {
    position: string;
    team: string;
    matches: string;
    wins: string;
    losses: string;
    ties: string;
    nrr: string;
    for: string;
    against: string;
    points: string;
    recentForm: string;
}

const PointsTable = () => {
    const [pointsTable, setPointsTable] = useState<TeamData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/point-table");

                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }

                const data = await response.json();
                const top10 = data.table.slice(1, 11);
                setPointsTable(top10);
                console.log(top10);
            } catch (error) {
                console.error("Error fetching points table:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p className="loading">Loading...</p>;

    const chartData = pointsTable.map((team) => ({
        name: team.team,
        points: parseInt(team.losses) * 2,
    }));

    return (
        <div className="container">
            <h2 className="title">IPL Points Table</h2>
            <div className="table-container">
                <table className="points-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <th>M</th>
                            <th>W</th>
                            <th>L</th>
                            <th>T</th>
                            <th>NRR</th>
                            <th>For</th>
                            <th>Against</th>
                            <th>Pts</th>
                            <th>Recent Form</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pointsTable.map((team, index) => (
                            <tr key={index}>
                                <td>{team.position}</td>
                                <td className="team-name">{team.team}</td>
                                <td className="wins">{team.wins}</td>
                                <td className="losses">{team.losses}</td>
                                <td>{team.ties}</td>
                                <td>{team.nrr}</td>
                                <td>{team.for}</td>
                                <td>{team.against}</td>
                                <td >{team.points}</td>
                                <td className="points">{parseInt(team.losses) * 2}</td>
                                <td>
                                    <span className="form-badge">{team.recentForm}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h2 className="title">Team Points Comparison</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            type="number"
                            stroke="#8884d8"
                            tickFormatter={(tick) => `${tick}`}
                            tick={{ fontSize: 12, fontWeight: 600 }}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#8884d8"
                            tick={{ fontSize: 12, fontWeight: 600 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#333',
                                borderRadius: '5px',
                                padding: '10px',
                                color: 'white',
                            }}
                            itemStyle={{ fontSize: '14px' }}
                            labelStyle={{ fontWeight: 'bold' }}
                        />

                        <Bar
                            dataKey="points"
                            fill="url(#gradient)"
                            animationDuration={1000}
                            barSize={30}
                            radius={[5, 5, 5, 5]}
                        />

                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4caf50" stopOpacity={1} />
                                <stop offset="100%" stopColor="#ff5722" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PointsTable;