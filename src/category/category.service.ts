import { Injectable, ParseIntPipe, Req } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'

@Injectable()
export class CategoryService extends PrismaClient {
  constructor() { super() }

  // 返回所有的商品数据，包含商品类型，商品基本信息，以及一张图片
  async getAllCategory() {
    const result = await this.product_category.findMany({
      include: {
        product: {
          take: 8,
          select: {
            id: true,
            name: true,
            title: true,
            price: true,
            selling_price: true,
            product_picture: {
              take: 1
            }
          }
        }
      }
    })
    return result
  }

  // 根据商品类型返回对应类型的数据
  // 可能返回所有商品，也有可能返回对应种类的商品
  async getUniquCategory(id: number, page: number = 1) {
    let result = null, total = null
    if (id === 0) { //返回所有商品
      result = await this.product.findMany({
        skip: 15 * (page - 1),
        take: 15,
        select: {
          id: true,
          name: true,
          title: true,
          price: true,
          selling_price: true,
          product_picture: {
            take: 1
          }
        }
      })
      total = await this.product.count()
      result = { product: result}
    } else {   // 返回指定类型的 商品
      result = await this.product_category.findUnique({
        where: { id },
        include: {
          _count: true,
          product: {
            skip: 15 * (page - 1),
            take: 15,
            select: {
              id: true,
              name: true,
              title: true,
              price: true,
              selling_price: true,
              product_picture: {
                take: 1
              }
            }
          }
        }
      })
      total = result._count.product
      delete result._count
    }
    return { data: result, total }
  }

  async getUniquProduct(id: number) {
    const result = this.product.findUnique({
      where: { id },
      include: {
        product_picture: true
      }
    })
    return result
  }

  async fuzzyFind(key: string, page: number) {
    const totalProduct = await this.product.findMany({
      where: {
        name: {
          contains: key
        }
      },
    })
    const total = totalProduct.length;
    const product = await this.product.findMany({
      take: 15,
      skip: 15 * (page - 1),
      where: {
        name: {
          contains: key
        }
      },
      select: {
        id: true,
        name: true,
        title: true,
        price: true,
        selling_price: true,
        product_picture: {
          take: 1,
          select: {
            pic_url: true
          }
        }
      }
    })
    return {
      product, total
    }
  }

}
