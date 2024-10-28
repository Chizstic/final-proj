import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const response = await axios.post(
                'https://api.paymongo.com/v1/links',
                req.body, // Pass the request body from the frontend
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${PAYMONGO_SECRET_KEY}:`).toString('base64')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return res.status(200).json(response.data);
        } catch (error) {
            // Type assertion to AxiosError
            const axiosError = error as AxiosError;

            console.error(axiosError.response?.data || axiosError.message);
            return res.status(axiosError.response?.status || 500).json({ message: axiosError.message });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
