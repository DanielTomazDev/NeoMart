import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';

dotenv.config();

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
    process.exit(1);
  }
};

// Dados de exemplo
const seedData = async () => {
  try {
    console.log('🌱 Iniciando seed...');

    // Limpar dados existentes (CUIDADO!)
    console.log('🗑️  Limpando dados antigos...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    // Não vamos limpar usuários para não perder a conta que você criou

    // 1. Criar Categorias
    console.log('📁 Criando categorias...');
    const categories = await Category.insertMany([
      {
        name: 'Eletrônicos',
        slug: 'eletronicos',
        description: 'Smartphones, tablets e acessórios tecnológicos',
        isActive: true,
      },
      {
        name: 'Computadores',
        slug: 'computadores',
        description: 'Notebooks, PCs e periféricos',
        isActive: true,
      },
      {
        name: 'Moda',
        slug: 'moda',
        description: 'Roupas, calçados e acessórios',
        isActive: true,
      },
      {
        name: 'Casa',
        slug: 'casa',
        description: 'Móveis, decoração e utilidades domésticas',
        isActive: true,
      },
      {
        name: 'Esportes',
        slug: 'esportes',
        description: 'Equipamentos e roupas esportivas',
        isActive: true,
      },
    ]);

    console.log(`✅ ${categories.length} categorias criadas`);

    // 2. Buscar ou criar usuário vendedor
    console.log('👤 Buscando usuário vendedor...');
    let seller = await User.findOne({ role: 'seller' });
    
    if (!seller) {
      console.log('👤 Criando usuário vendedor de exemplo...');
      seller = await User.create({
        name: 'Loja Neomart',
        email: 'loja@neomart.com',
        password: '123456',
        role: 'seller',
        isVerified: true,
      });
    }

    console.log(`✅ Vendedor: ${seller.name}`);

    // 3. Criar Produtos
    console.log('📦 Criando produtos...');
    
    const products = [
      // Eletrônicos
      {
        title: 'iPhone 15 Pro Max 256GB',
        description: 'iPhone 15 Pro Max com chip A17 Pro, sistema de câmera Pro avançado e tela Super Retina XDR. Design em titânio e bateria de longa duração.',
        price: 8999.00,
        originalPrice: 9999.00,
        category: categories[0]._id,
        seller: seller._id,
        stock: 25,
        condition: 'new',
        brand: 'Apple',
        images: [{
          url: 'https://via.placeholder.com/600x600/1e40af/ffffff?text=iPhone+15+Pro',
          alt: 'iPhone 15 Pro Max'
        }],
        specifications: [
          { key: 'Tela', value: '6.7" Super Retina XDR' },
          { key: 'Processador', value: 'Apple A17 Pro' },
          { key: 'Memória', value: '256GB' },
          { key: 'Câmera', value: '48MP + 12MP + 12MP' },
        ],
        shipping: { freeShipping: true, weight: 500 },
        isFeatured: true,
        tags: ['smartphone', 'apple', 'iphone', '5g'],
      },
      {
        title: 'Samsung Galaxy S24 Ultra 512GB',
        description: 'Galaxy S24 Ultra com S Pen integrada, câmera de 200MP, tela Dynamic AMOLED 2X e processador Snapdragon 8 Gen 3.',
        price: 7499.00,
        originalPrice: 8499.00,
        category: categories[0]._id,
        seller: seller._id,
        stock: 30,
        condition: 'new',
        brand: 'Samsung',
        images: [{
          url: 'https://via.placeholder.com/600x600/6366f1/ffffff?text=Galaxy+S24',
          alt: 'Samsung Galaxy S24 Ultra'
        }],
        shipping: { freeShipping: true, weight: 480 },
        isFeatured: true,
        tags: ['smartphone', 'samsung', 'galaxy', 'android'],
      },
      
      // Computadores
      {
        title: 'MacBook Pro 14" M3 Pro 512GB',
        description: 'MacBook Pro com chip M3 Pro, tela Liquid Retina XDR de 14 polegadas, até 18 horas de bateria e design premium em alumínio.',
        price: 15999.00,
        originalPrice: 17999.00,
        category: categories[1]._id,
        seller: seller._id,
        stock: 15,
        condition: 'new',
        brand: 'Apple',
        images: [{
          url: 'https://via.placeholder.com/600x600/374151/ffffff?text=MacBook+Pro',
          alt: 'MacBook Pro'
        }],
        specifications: [
          { key: 'Processador', value: 'Apple M3 Pro' },
          { key: 'RAM', value: '16GB' },
          { key: 'Armazenamento', value: '512GB SSD' },
          { key: 'Tela', value: '14" Liquid Retina XDR' },
        ],
        shipping: { freeShipping: true, weight: 1600 },
        isFeatured: true,
        tags: ['notebook', 'apple', 'macbook', 'profissional'],
      },
      {
        title: 'Dell XPS 15 i7 16GB 512GB RTX 4050',
        description: 'Dell XPS 15 com processador Intel Core i7 13ª geração, placa de vídeo NVIDIA RTX 4050, tela 4K OLED touch.',
        price: 9999.00,
        originalPrice: 11999.00,
        category: categories[1]._id,
        seller: seller._id,
        stock: 12,
        condition: 'new',
        brand: 'Dell',
        images: [{
          url: 'https://via.placeholder.com/600x600/0ea5e9/ffffff?text=Dell+XPS',
          alt: 'Dell XPS 15'
        }],
        shipping: { freeShipping: true, weight: 2000 },
        isFeatured: true,
        tags: ['notebook', 'dell', 'gamer', 'profissional'],
      },
      {
        title: 'Mouse Gamer Logitech G502 HERO',
        description: 'Mouse gamer com sensor HERO 25K, 11 botões programáveis, RGB personalizável e design ergonômico. Perfeito para gamers.',
        price: 349.90,
        originalPrice: 499.90,
        category: categories[1]._id,
        seller: seller._id,
        stock: 50,
        condition: 'new',
        brand: 'Logitech',
        images: [{
          url: 'https://via.placeholder.com/600x600/8b5cf6/ffffff?text=Mouse+G502',
          alt: 'Mouse Gamer'
        }],
        shipping: { freeShipping: false, weight: 150 },
        tags: ['mouse', 'gamer', 'logitech', 'rgb'],
      },

      // Moda
      {
        title: 'Tênis Nike Air Max 270',
        description: 'Tênis Nike Air Max 270 com visual moderno, amortecimento Air Max e conforto incomparável. Ideal para o dia a dia.',
        price: 799.90,
        originalPrice: 999.90,
        category: categories[2]._id,
        seller: seller._id,
        stock: 40,
        condition: 'new',
        brand: 'Nike',
        images: [{
          url: 'https://via.placeholder.com/600x600/ef4444/ffffff?text=Nike+Air+Max',
          alt: 'Nike Air Max 270'
        }],
        shipping: { freeShipping: true, weight: 800 },
        tags: ['tênis', 'nike', 'airmax', 'casual'],
      },
      {
        title: 'Jaqueta Jeans Levi\'s Trucker',
        description: 'Jaqueta jeans clássica Levi\'s Trucker, 100% algodão, corte regular e estilo atemporal. Um ícone da moda.',
        price: 549.90,
        originalPrice: 699.90,
        category: categories[2]._id,
        seller: seller._id,
        stock: 35,
        condition: 'new',
        brand: 'Levi\'s',
        images: [{
          url: 'https://via.placeholder.com/600x600/3b82f6/ffffff?text=Levi%27s+Jaqueta',
          alt: 'Jaqueta Jeans'
        }],
        shipping: { freeShipping: true, weight: 600 },
        tags: ['jaqueta', 'jeans', 'levis', 'moda'],
      },

      // Casa
      {
        title: 'Aspirador de Pó Robô Xiaomi S10',
        description: 'Aspirador robô inteligente com mapeamento a laser, sucção de 4000Pa, conectividade Wi-Fi e controle por app.',
        price: 2199.00,
        originalPrice: 2799.00,
        category: categories[3]._id,
        seller: seller._id,
        stock: 20,
        condition: 'new',
        brand: 'Xiaomi',
        images: [{
          url: 'https://via.placeholder.com/600x600/f59e0b/ffffff?text=Aspirador+Robô',
          alt: 'Aspirador Robô'
        }],
        shipping: { freeShipping: true, weight: 3500 },
        isFeatured: true,
        tags: ['aspirador', 'robô', 'xiaomi', 'smart'],
      },

      // Esportes
      {
        title: 'Bicicleta Mountain Bike Caloi Elite 2024',
        description: 'Mountain bike profissional com quadro de alumínio, 21 marchas Shimano, freios a disco e suspensão dianteira.',
        price: 2499.00,
        originalPrice: 2999.00,
        category: categories[4]._id,
        seller: seller._id,
        stock: 10,
        condition: 'new',
        brand: 'Caloi',
        images: [{
          url: 'https://via.placeholder.com/600x600/10b981/ffffff?text=MTB+Caloi',
          alt: 'Mountain Bike'
        }],
        shipping: { freeShipping: true, weight: 14000 },
        isFeatured: true,
        tags: ['bicicleta', 'mtb', 'caloi', 'esporte'],
      },
      {
        title: 'Kit 2 Halteres 10kg cada Revestidos',
        description: 'Par de halteres com revestimento emborrachado, pegada ergonômica e formato sextavado para evitar rolamento.',
        price: 189.90,
        originalPrice: 249.90,
        category: categories[4]._id,
        seller: seller._id,
        stock: 60,
        condition: 'new',
        brand: 'FitLife',
        images: [{
          url: 'https://via.placeholder.com/600x600/6366f1/ffffff?text=Halteres',
          alt: 'Halteres'
        }],
        shipping: { freeShipping: false, weight: 20000 },
        tags: ['halter', 'musculação', 'fitness', 'treino'],
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} produtos criados`);

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   • Categorias: ${categories.length}`);
    console.log(`   • Produtos: ${createdProducts.length}`);
    console.log(`   • Vendedor: ${seller.email}`);
    console.log('\n🌐 Acesse: http://localhost:3001');
    console.log('   E veja os produtos na home page!\n');

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Conexão fechada');
    process.exit(0);
  }
};

// Executar
connectDB().then(() => seedData());


