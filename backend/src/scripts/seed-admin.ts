import bcrypt from 'bcrypt';
import dataSource from '../database/typeorm/data-source';
import { User } from '../database/typeorm/entity/Users/User.entity';

// Идемпотентно создаёт первого админа из ADMIN_EMAIL/ADMIN_PASSWORD.
export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('[seed-admin] ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping');
    return;
  }

  const userRepo = dataSource.getRepository(User);
  const existing = await userRepo.findOne({ where: { email } });

  if (existing) {
    console.log(`[seed-admin] admin ${email} already exists`);
    return;
  }

  const user = userRepo.create({
    email,
    password: await bcrypt.hash(password, 10),
    fullName: 'Admin',
  });
  await userRepo.save(user);
  console.log(`[seed-admin] admin ${email} created`);
}
