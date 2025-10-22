const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMyCustomData() {
  try {
    // 你的自定义数据
    const myTags = [
      {
        name: '我的标签1',
        slug: 'my-tag-1',
        description: '这是我自定义的标签',
        color: '#FF0000'
      },
      {
        name: '我的标签2', 
        slug: 'my-tag-2',
        description: '另一个自定义标签',
        color: '#00FF00'
      }
    ];
    
    console.log('🚀 添加我的自定义数据...');
    
    for (const tag of myTags) {
      const newTag = await prisma.tag.create({
        data: tag
      });
      console.log(`✅ 添加成功: ${newTag.name}`);
    }
    
    console.log('🎉 自定义数据添加完成！');
    
  } catch (error) {
    console.error('❌ 添加失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMyCustomData();
