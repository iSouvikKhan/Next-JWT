import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import { config } from '@/config/config';

const SECRET_KEY = 'fullstack-intern-assignment';

export const POST = async (req: NextRequest) => {
  const { username, password } = await req.json();

  // if (req.method !== 'POST') {
  //   return NextResponse.json({
  //     status: 405,
  //   })
  // }

  // Dummy user validation
  if (username === 'souvik' && password === 'assignment') {
    const token = jwt.sign({ username }, config.jwtSecret, { expiresIn: '1h' });
    return NextResponse.json({
      token: token,
    }, {
      status: 200,
    })
  }

  return NextResponse.json({
    message: 'Invalid credentials'
  }, {
    status: 401,
  })
}
