import { PrismaClient } from '@prisma/client';
import { IOrderData } from './interfaces';

const prisma = new PrismaClient()

export default prisma