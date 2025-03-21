import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from "recharts";
import axios from "axios";
import { Card } from "./components/ui/Card";
import dayjs from "dayjs";

const API_URL = "https://67d58d2f286fdac89bbfaa45.mockapi.io/api/chart/Temperature"; // URL của MockAPI
const thresholds = [25, 50, 120]; // ngưỡng

const fetchData = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};

export default function SensorChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const sensorData = await fetchData();
                const formattedData = sensorData.map(item => ({
                    ...item,
                    timestamp: dayjs(item.timestamp).format("HH:mm:ss DD/MM/YYYY"),
                }));
                setData(formattedData);
            } catch (error) {
                setError("Error fetching data.");
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    
    const getThresholdData = (min, max) => {
        return data.map(item => ({
            ...item,
            temperature: item.temperature >= min && item.temperature < max ? item.temperature : null
        }));
    };

    return (
        <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Biểu đồ nhiệt độ & độ ẩm</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Area
                        type="monotone"
                        dataKey="temperature"
                        data={getThresholdData(0, thresholds[0])}
                        stroke="none"
                        fill="#00FF00"  // Màu xanh 
                        fillOpacity={0.3}
                    />
                    <Area
                        type="monotone"
                        dataKey="temperature"
                        data={getThresholdData(thresholds[0], thresholds[1])}
                        stroke="none"
                        fill="#FFA500"  // Màu cam 
                        fillOpacity={0.3}
                    />
                    <Area
                        type="monotone"
                        dataKey="temperature"
                        data={getThresholdData(thresholds[1], thresholds[2])}
                        stroke="none"
                        fill="#FF0000"  // Màu đỏ
                        fillOpacity={0.3}
                    />
                    <Area
                        type="monotone"
                        dataKey="temperature"
                        data={getThresholdData(thresholds[2], Infinity)}
                        stroke="none"
                        fill="#800080"  // Màu tím 
                        fillOpacity={0.3}
                    />

                    <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Nhiệt độ (°C)" />
                    <Line type="monotone" dataKey="humidity" stroke="#387908" name="Độ ẩm (%)" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}
