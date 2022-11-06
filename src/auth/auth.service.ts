import { Injectable, BadRequestException, ForbiddenException, Req, Body } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { CreateAuthDto } from './dto/create-auth.dto'
import { LoginAuthDto } from './dto/login-auth.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService extends PrismaClient {
  constructor(private readonly jwt: JwtService) {
    super()
  }
  // 用户注册
  async register({ username, password }: CreateAuthDto) {
    const getUser = await this.user.findUnique({
      where: { username }
    })
    if (getUser) throw new BadRequestException('已存在该用户')
    const user = await this.user.create({
      data: {
        username,
        password
      }
    })
    delete user.password
    return {
      token:
        'Bearer ' +
        (await this.jwt.signAsync({
          username: user.username,
          sub: user.id
        }))
    }
  }

  // 用户登录
  async login({ username, password }: LoginAuthDto) {
    const user = await this.user.findUnique({
      where: { username }
    })

    if (!user) throw new BadRequestException('用户名不存在')

    if (user.password !== password) throw new BadRequestException('密码错误')
    delete user.password
    return this.token(user)
  }

  // 返回 Jwt
  async token(user: { username: string; id: number }) {
    return {
      token:
        'Bearer ' +
        (await this.jwt.signAsync({
          username: user.username,
          sub: user.id
        }))
    }
  }

  // 获取用户信息
  getUserInfo(@Req() req) {
    return req.user
  }

  // 获取用户的购物车信息
  async getShopCart(@Req() req) {
    const result = await this.shoppingcart.findMany({
      where: {
        user_id: req.user.id
      },
      select: {
        id: true,
        num: true,
        product: {
          select: {
            id: true,
            name: true,
            selling_price: true,
            title: true,
            product_picture: {
              take: 1,
              select: {
                pic_url: true
              }
            }
          }
        }
      }
    })
    return result
  }
  // 向购物车添加商品
  async addToShopCart(@Req() req) {
    const {
      user,
      body: { id }
    } = req
    const nums = await this.shoppingcart.findFirst({
      where: {
        user_id: user.id,
        product_id: +id
      }
    })
    if (nums) {
      // 如果购物车已经有了该数据
      await this.shoppingcart.update({
        data: {
          num: nums.num + 1
        },
        where: {
          id: nums.id
        }
      })
    } else {
      // 如果是第一次进入购物车
      await this.shoppingcart.create({
        data: {
          user_id: user.id,
          product_id: +id,
          num: 1
        }
      })
    }

    return {
      message: '添加成功'
    }
  }

  // 从购物车移除商品
  async removeFromShopCart(@Req() req) {
    const {
      body: { id }
    } = req
    await this.shoppingcart.delete({
      where: {
        id: +id
      }
    })
    return {
      message: '移除成功'
    }
  }

  // 修改购物车商品数量
  async changeShopNum(@Req() req) {
    const {
      body: { id, num }
    } = req
    await this.shoppingcart.update({
      data: {
        num: +num
      },
      where: {
        id: +id
      }
    })
    return {
      message: '修改成功'
    }
  }

  // 向订单中添加数据
  async addToOrder(@Req() req) {
    const {
      body: { checkedShop }
    } = req
    const time = Date.now()
    const result = checkedShop.map((item) => {
      const product: any = {}
      product.order_id = parseInt(`${req.user.id + 10000}${time}`)
      product.user_id = req.user.id
      product.product_id = item.product.id
      product.product_num = item.num
      product.product_price = item.product.selling_price
      return product
    })
    const ids = checkedShop.map((item) => item.id)
    await this.order.createMany({
      data: result
    })
    await this.shoppingcart.deleteMany({
      where: {
        user_id: req.user.id,
        id: {
          in: ids
        }
      }
    })
    return {
      message: '添加成功'
    }
  }

  // 获取订单信息
  async getOrder(@Req() req) {
    const result = await this.order.findMany({
      take: 50,
      where: {
        user_id: req.user.id
      },
      orderBy: {
        order_id: 'desc'
      },
      include: {
        product: {
          select: {
            name: true,
            product_picture: {
              take: 1,
              select: {
                pic_url: true
              }
            }
          }
        }
      }
    })
    result.forEach((item) => {
      item.order_id = JSON.parse(item.order_id as any)
    })
    return result
  }

  // 加入我的收藏
  async addToCollect(@Req() req) {
    // 判断是否当前在收藏中已存在，存在就改变一下 is_delete 状态， 否则新建一个
    const {
      user,
      body: { id }
    } = req
    let collect = await this.collect.findFirst({
      where: {
        user_id: user.id,
        product_id: +id
      }
    })
    if (!collect) {
      // 如果当前用户暂不存在该收藏商品
      await this.collect.create({
        data: {
          user_id: user.id,
          product_id: +id
        }
      })
    } else {
      // 如果找到了该用户收藏的商品
      await this.collect.update({
        where: {
          id: collect.id
        },
        data: {
          is_delete: 0
        }
      })
    }
    return {
      message: '添加成功'
    }
  }
  // 获取我的收藏
  async getCollect(@Req() req) {
    const result = await this.collect.findMany({
      where: {
        is_delete: 0,
        user_id: req.user.id
      },
      include: {
        product: {
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
        }
      }
    })
    return result
  }
  // 移除出我的收藏
  async removeFromCollect(@Req() req) {
    const {
      body: { id }
    } = req
    await this.collect.update({
      where: { id: +id },
      data: {
        is_delete: 1
      }
    })
    return {
      message: '删除成功'
    }
  }
  // 判断当前商品是否在用户收藏中
  async checkCollect(@Req() req) {
    const {
      body: { id }
    } = req
    let result = await this.collect.findFirst({
      where: {
        user_id: req.user.id,
        product_id: +id,
        is_delete: 0
      }
    })
    if (result) {
      return {
        is_delete: 0
      }
    } else {
      return {
        is_delete: 1
      }
    }
  }
}
