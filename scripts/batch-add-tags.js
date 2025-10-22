const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 批量添加标签的函数
async function batchAddTags(tagsData) {
  try {
    console.log(`🚀 开始批量添加 ${tagsData.length} 个标签...`);
    
    // 逐个检查并创建（SQLite 不支持 skipDuplicates）
    let successCount = 0;
    for (const tagData of tagsData) {
      try {
        await prisma.tag.create({
          data: tagData
        });
        successCount++;
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  标签 "${tagData.slug}" 已存在，跳过`);
        } else {
          throw error;
        }
      }
    }
    
    const result = { count: successCount };
    
    console.log(`✅ 成功添加 ${result.count} 个标签`);
    return result;
    
  } catch (error) {
    console.error('❌ 批量添加失败:', error);
    throw error;
  }
}

// 单个添加标签的函数
async function addSingleTag(tagData) {
  try {
    console.log(`➕ 添加标签: ${tagData.name}`);
    
    const newTag = await prisma.tag.create({
      data: tagData
    });
    
    console.log(`✅ 成功添加: ${newTag.name} (${newTag.slug})`);
    return newTag;
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log(`⚠️  标签 "${tagData.slug}" 已存在，跳过`);
      return null;
    }
    console.error('❌ 添加失败:', error);
    throw error;
  }
}

// 示例：添加技术栈标签
async function addTechStackTags() {
  const techTags = [
    { name: 'Python', slug: 'python', description: 'Python 编程语言', color: '#3776ab' },
    { name: 'Java', slug: 'java', description: 'Java 编程语言', color: '#f89820' },
    { name: 'Go', slug: 'golang', description: 'Go 编程语言', color: '#00add8' },
    { name: 'Rust', slug: 'rust', description: 'Rust 编程语言', color: '#000000' },
    { name: 'PHP', slug: 'php', description: 'PHP 编程语言', color: '#777bb4' }
  ];
  
  await batchAddTags(techTags);
}

// 示例：添加框架标签
async function addFrameworkTags() {
  const frameworkTags = [
    { name: 'Express.js', slug: 'express', description: 'Node.js Web 框架', color: '#000000' },
    { name: 'Koa.js', slug: 'koa', description: 'Node.js Web 框架', color: '#33333d' },
    { name: 'Fastify', slug: 'fastify', description: 'Node.js Web 框架', color: '#202020' },
    { name: 'NestJS', slug: 'nestjs', description: 'Node.js 企业级框架', color: '#e0234e' }
  ];
  
  for (const tag of frameworkTags) {
    await addSingleTag(tag);
  }
}

// 主函数
async function main() {
  try {
    console.log('🎯 开始添加技术标签...\n');
    
    // 添加编程语言标签
    console.log('📚 添加编程语言标签:');
    await addTechStackTags();
    
    console.log('\n🔧 添加框架标签:');
    await addFrameworkTags();
    
    // 显示最终结果
    const totalTags = await prisma.tag.count();
    console.log(`\n🎉 完成！数据库中共有 ${totalTags} 个标签`);
    
  } catch (error) {
    console.error('❌ 执行失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

// 导出函数供其他脚本使用
module.exports = {
  batchAddTags,
  addSingleTag,
  addTechStackTags,
  addFrameworkTags
};
