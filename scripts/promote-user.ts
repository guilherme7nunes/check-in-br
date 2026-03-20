import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const email = 'gmts@hotmail.com.br'
  console.log(`Buscando usuário: ${email}`)
  
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.log('Usuário não encontrado!')
    return
  }

  await prisma.user.update({
    where: { email },
    data: { role: 'ORGANIZER' }
  })
}

main()
  .then(() => console.log('SUCESSO: Guilherme agora é ORGANIZADOR! 🏁'))
  .catch(e => console.error('ERRO NO SCRIPT:', e))
  .finally(async () => await prisma.$disconnect())
