import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';

const env = express.env;
const router = express.Router();

//회원가입 API

router.post('/sign-up', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isExistUser = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (isExistUser) {
      return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const accountRegex = /^[a-z0-9]+$/;
    if (!accountRegex.test(email)) {
      return res.status(400).json({ message: '아이디는 영어 소문자와 숫자의 조합이어야 합니다.' });
    }
    if (!password) {
      return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
    }
    // if (password !== confirmPassword) {
    //   return res.status(400).json({ message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
    // }
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return res.status(200).json({ userId: user.email, users: user.password });
  } catch (error) {
    console.error('회원가입중 에러가 발생했습니다:', error);
    return res.status(500).json({ message: '회원가입 중 에러가 발생하였습니다.' });
  }
});

//로그인 API
router.post('/sign-in', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findFirst({ where: { email } });
    console.log(user);

    if (!user) return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
    else if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

    const token = jwt.sign({ userId: user.id }, 'jwt-secret');

    res.cookie('authorization', `Bearer ${token}`);
    return res.status(200).json({ message: '로그인에 성공하였습니다.' });
  } catch (error) {
    console.error('로그인 중 에러 발생', error);
    return res.status(500).json({ message: '로그인 중 에러가 발생하였습니다.' });
  }
});

export default router;
