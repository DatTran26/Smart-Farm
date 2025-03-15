import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Card } from "./components/ui/Card";



const API_URL = "https://67d58d2f286fdac89bbfaa45.mockapi.io/api/chart/Temperature"; // URL của MockAPI

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

    useEffect(() => {
        const getData = async () => {
            const sensorData = await fetchData();
            setData(sensorData);
        };
        getData();
    }, []);

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
                    <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Nhiệt độ (°C)" />
                    <Line type="monotone" dataKey="humidity" stroke="#387908" name="Độ ẩm (%)" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}
