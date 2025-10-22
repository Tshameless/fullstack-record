const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 修改单个标签的函数
async function updateTag(id, updateData) {
  try {
    console.log(`🔄 正在修改标签 ID: ${id}`);
    
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: updateData
    });
    
    console.log('✅ 修改成功！');
    console.log(`   名称: ${updatedTag.name}`);
    console.log(`   标识: ${updatedTag.slug}`);
    console.log(`   描述: ${updatedTag.description || '无'}`);
    console.log(`   颜色: ${updatedTag.color || '无'}`);
    console.log(`   更新时间: ${updatedTag.updatedAt}`);
    
    return updatedTag;
    
  } catch (error) {
    if (error.code === 'P2025') {
      console.log('❌ 标签不存在');
    } else if (error.code === 'P2002') {
      console.log('❌ slug 已存在，请使用其他标识');
    } else {
      console.error('❌ 修改失败:', error.message);
    }
    throw error;
  }
}

// 批量修改标签的函数
async function batchUpdateTags(updates) {
  try {
    console.log(`🚀 开始批量修改 ${updates.length} 个标签...`);
    
    const results = [];
    for (const update of updates) {
      const { id, ...updateData } = update;
      const result = await updateTag(id, updateData);
      results.push(result);
    }
    
    console.log(`✅ 批量修改完成，共修改 ${results.length} 个标签`);
    return results;
    
  } catch (error) {
    console.error('❌ 批量修改失败:', error);
    throw error;
  }
}

// 根据条件修改标签的函数
async function updateTagsByCondition(condition, updateData) {
  try {
    console.log('🔍 根据条件修改标签...');
    
    const result = await prisma.tag.updateMany({
      where: condition,
      data: updateData
    });
    
    console.log(`✅ 修改完成，共影响 ${result.count} 个标签`);
    return result;
    
  } catch (error) {
    console.error('❌ 条件修改失败:', error);
    throw error;
  }
}

// 示例：修改特定标签
async function updateSpecificTag() {
  // 先获取一个标签的 ID
  const tags = await prisma.tag.findMany({ take: 1 });
  if (tags.length === 0) {
    console.log('❌ 没有找到标签');
    return;
  }
  
  const tagId = tags[0].id;
  console.log(`📝 修改标签: ${tags[0].name} (${tagId})`);
  
  await updateTag(tagId, {
    name: '修改后的标签',
    description: '这是修改后的描述',
    color: '#FF0000'
  });
}

// 示例：批量修改
async function batchUpdateExample() {
  const tags = await prisma.tag.findMany({ take: 3 });
  
  if (tags.length === 0) {
    console.log('❌ 没有找到标签');
    return;
  }
  
  const updates = tags.map((tag, index) => ({
    id: tag.id,
    name: `批量修改标签 ${index + 1}`,
    description: `批量修改的描述 ${index + 1}`,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`
  }));
  
  await batchUpdateTags(updates);
}

// 示例：条件修改
async function conditionalUpdateExample() {
  // 修改所有没有颜色的标签
  await updateTagsByCondition(
    { color: null },
    { color: '#CCCCCC' }
  );
}

// 主函数
async function main() {
  try {
    console.log('🎯 数据修改工具');
    console.log('═══════════════════════════════════════');
    
    // 显示当前数据
    const allTags = await prisma.tag.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('\n📋 当前标签（前5个）:');
    allTags.forEach((tag, index) => {
      console.log(`${index + 1}. ${tag.name} (${tag.slug}) - ${tag.color || '无颜色'}`);
    });
    
    console.log('\n🔄 开始修改操作...');
    
    // 执行修改示例
    await updateSpecificTag();
    
    console.log('\n🎉 修改操作完成！');
    
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
  updateTag,
  batchUpdateTags,
  updateTagsByCondition
};
