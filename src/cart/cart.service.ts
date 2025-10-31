import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CartItem } from './entities/cart-item.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  /**
   * Busca todos os itens do carrinho para um utilizador específico.
   */
  async findByUserId(userId: string): Promise<CartItem[]> {
    return this.cartItemsRepository.find({
      where: { userId },
      relations: ['product'], // Carrega os detalhes do produto associado
      order: { addedAt: 'ASC' },
    });
  }

  /**
   * Adiciona um item ao carrinho.
   * Se o item já existir, apenas incrementa a quantidade.
   */
  async addItem(userId: string, addCartItemDto: AddCartItemDto): Promise<CartItem> {
    const { productId, quantity } = addCartItemDto;

    // Verifica se o produto que se está a tentar adicionar existe
    const product = await this.productsRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Produto com ID "${productId}" não encontrado.`);
    }

    // Verifica se o item já existe no carrinho do utilizador
    let cartItem = await this.cartItemsRepository.findOne({
      where: { userId, productId },
    });

    if (cartItem) {
      // Se existir, atualiza a quantidade
      cartItem.quantity += quantity;
    } else {
      // Se não existir, cria um novo item
      cartItem = this.cartItemsRepository.create({
        id: uuid(),
        userId,
        productId,
        quantity,
      });
    }

    // Salva o item (novo ou atualizado) na base de dados
    return this.cartItemsRepository.save(cartItem);
  }

  /**
   * Atualiza a quantidade de um item específico no carrinho.
   */
  async updateItemQuantity(userId: string, productId: string, updateDto: UpdateCartItemDto): Promise<CartItem> {
    const { quantity } = updateDto;

    const cartItem = await this.cartItemsRepository.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item do carrinho não encontrado.');
    }

    cartItem.quantity = quantity;
    return this.cartItemsRepository.save(cartItem);
  }

  /**
   * Remove um item específico do carrinho.
   */
  async removeItem(userId: string, productId: string): Promise<void> {
    const cartItem = await this.cartItemsRepository.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item do carrinho não encontrado.');
    }

    await this.cartItemsRepository.remove(cartItem);
  }

  /**
   * Remove todos os itens do carrinho de um utilizador.
   */
  async clearCart(userId: string): Promise<void> {
    await this.cartItemsRepository.delete({ userId });
  }
}
