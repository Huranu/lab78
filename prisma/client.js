const { PrismaClient } = require('@prisma/client');
const bcrypt=require('bcrypt')

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      user: {
        $allOperations({ operation, args, query }) {
          if (['create', 'update'].includes(operation) && args.data['password']) {
            args.data['password'] = bcrypt.hashSync(args.data['password'], 10)
          }
          return query(args)
        }
      }
    }
  });
};

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      $allOperations({ operation, args, query }) {
        if (['create', 'update'].includes(operation) && args.data['password']) {
          args.data['password'] = bcrypt.hashSync(args.data['password'], 10)
        }
        return query(args)
      }
    }
  }
})

global.prisma = global.prisma || prismaClientSingleton();

module.exports = global.prisma;

if (process.env.NODE_ENV !== 'production') {
  global.prisma = module.exports;
}