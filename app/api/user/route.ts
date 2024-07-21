import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers';
import { config } from '@/config/config';


export const  GET = async() => {
  const authHeader = headers().get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({
      status: 401,
    })
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return NextResponse.json({
      user: decoded
    }, {
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      message: 'Invalid credentials'
    }, {
      status: 403,
    })
  }
}
