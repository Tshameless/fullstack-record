const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 示例数据
const sampleTags = [
  {
    name: '前端开发',
    slug: 'frontend',
    description: '前端开发相关技术',
    color: '#FF6B6B'
  },
  {
    name: '后端开发',
    slug: 'backend',
    description: '后端开发相关技术',
    color: '#4ECDC4'
  },
  {
    name: '数据库',
    slug: 'database',
    description: '数据库相关技术',
    color: '#45B7D1'
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: '开发运维相关技术',
    color: '#96CEB4'
  },
  {
    name: '机器学习',
    slug: 'machine-learning',
    description: '机器学习和人工智能',
    color: '#FFEAA7'
  }
];

async function seedData() {
  try {
    console.log('🌱 开始添加种子数据...');
    
    for (const tagData of sampleTags) {
      // 检查是否已存在
      const existing = await prisma.tag.findUnique({
        where: { slug: tagData.slug }
      });
      
      if (existing) {
        console.log(`⚠️  标签 "${tagData.name}" (${tagData.slug}) 已存在，跳过`);
        continue;
      }
      
      // 创建新标签
      const newTag = await prisma.tag.create({
        data: tagData
      });
      
      console.log(`✅ 成功添加标签: ${newTag.name} (${newTag.slug})`);
    }
    
    console.log('🎉 种子数据添加完成！');
    
    // 显示当前所有标签
    const allTags = await prisma.tag.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`\n📊 当前数据库中共有 ${allTags.length} 个标签:`);
    allTags.forEach((tag, index) => {
      console.log(`${index + 1}. ${tag.name} (${tag.slug}) - ${tag.color || '无颜色'}`);
    });
    
  } catch (error) {
    console.error('❌ 添加数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行种子数据添加
seedData();
