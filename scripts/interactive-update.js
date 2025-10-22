const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 询问用户输入的函数
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// 显示所有标签
async function showAllTags() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`\n📋 当前数据库中的标签 (共 ${tags.length} 个):`);
    console.log('═══════════════════════════════════════');
    
    tags.forEach((tag, index) => {
      console.log(`${index + 1}. ID: ${tag.id}`);
      console.log(`   名称: ${tag.name}`);
      console.log(`   标识: ${tag.slug}`);
      console.log(`   描述: ${tag.description || '无'}`);
      console.log(`   颜色: ${tag.color || '无'}`);
      console.log(`   创建时间: ${tag.createdAt.toLocaleString()}`);
      console.log('   ───────────────────────────────────────');
    });
    
    return tags;
    
  } catch (error) {
    console.error('❌ 获取标签列表失败:', error.message);
    return [];
  }
}

// 修改标签的交互式函数
async function updateTagInteractive() {
  try {
    console.log('\n🔄 修改标签');
    console.log('═══════════════════════════════════════');
    
    // 显示所有标签
    const tags = await showAllTags();
    if (tags.length === 0) {
      console.log('❌ 没有找到标签');
      return;
    }
    
    const tagIndex = await askQuestion(`\n请选择要修改的标签 (1-${tags.length}): `);
    const index = parseInt(tagIndex) - 1;
    
    if (index < 0 || index >= tags.length) {
      console.log('❌ 无效选择');
      return;
    }
    
    const selectedTag = tags[index];
    console.log(`\n📝 当前标签信息:`);
    console.log(`   名称: ${selectedTag.name}`);
    console.log(`   标识: ${selectedTag.slug}`);
    console.log(`   描述: ${selectedTag.description || '无'}`);
    console.log(`   颜色: ${selectedTag.color || '无'}`);
    
    // 询问要修改的字段
    console.log('\n请选择要修改的字段:');
    console.log('1. 名称');
    console.log('2. 标识 (slug)');
    console.log('3. 描述');
    console.log('4. 颜色');
    console.log('5. 全部修改');
    
    const fieldChoice = await askQuestion('请选择 (1-5): ');
    
    let updateData = {};
    
    switch (fieldChoice) {
      case '1':
        const newName = await askQuestion('新名称: ');
        if (newName) updateData.name = newName;
        break;
        
      case '2':
        const newSlug = await askQuestion('新标识: ');
        if (newSlug) updateData.slug = newSlug;
        break;
        
      case '3':
        const newDescription = await askQuestion('新描述: ');
        updateData.description = newDescription || null;
        break;
        
      case '4':
        const newColor = await askQuestion('新颜色 (如 #FF0000): ');
        if (newColor) updateData.color = newColor;
        break;
        
      case '5':
        const name = await askQuestion('新名称: ');
        const slug = await askQuestion('新标识: ');
        const description = await askQuestion('新描述: ');
        const color = await askQuestion('新颜色: ');
        
        if (name) updateData.name = name;
        if (slug) updateData.slug = slug;
        updateData.description = description || null;
        if (color) updateData.color = color;
        break;
        
      default:
        console.log('❌ 无效选择');
        return;
    }
    
    if (Object.keys(updateData).length === 0) {
      console.log('❌ 没有要修改的内容');
      return;
    }
    
    // 执行修改
    const updatedTag = await prisma.tag.update({
      where: { id: selectedTag.id },
      data: updateData
    });
    
    console.log('\n✅ 修改成功！');
    console.log(`   名称: ${updatedTag.name}`);
    console.log(`   标识: ${updatedTag.slug}`);
    console.log(`   描述: ${updatedTag.description || '无'}`);
    console.log(`   颜色: ${updatedTag.color || '无'}`);
    console.log(`   更新时间: ${updatedTag.updatedAt.toLocaleString()}`);
    
  } catch (error) {
    if (error.code === 'P2025') {
      console.log('❌ 标签不存在');
    } else if (error.code === 'P2002') {
      console.log('❌ slug 已存在，请使用其他标识');
    } else {
      console.error('❌ 修改失败:', error.message);
    }
  }
}

// 删除标签的交互式函数
async function deleteTagInteractive() {
  try {
    console.log('\n🗑️  删除标签');
    console.log('═══════════════════════════════════════');
    
    const tags = await showAllTags();
    if (tags.length === 0) {
      console.log('❌ 没有找到标签');
      return;
    }
    
    const tagIndex = await askQuestion(`\n请选择要删除的标签 (1-${tags.length}): `);
    const index = parseInt(tagIndex) - 1;
    
    if (index < 0 || index >= tags.length) {
      console.log('❌ 无效选择');
      return;
    }
    
    const selectedTag = tags[index];
    console.log(`\n⚠️  即将删除标签: ${selectedTag.name} (${selectedTag.slug})`);
    
    const confirm = await askQuestion('确认删除吗？(y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      console.log('❌ 取消删除');
      return;
    }
    
    await prisma.tag.delete({
      where: { id: selectedTag.id }
    });
    
    console.log('✅ 删除成功！');
    
  } catch (error) {
    if (error.code === 'P2025') {
      console.log('❌ 标签不存在');
    } else {
      console.error('❌ 删除失败:', error.message);
    }
  }
}

// 主菜单
async function showMenu() {
  console.log('\n🎯 数据库管理工具');
  console.log('═══════════════════════════════════════');
  console.log('1. 查看所有标签');
  console.log('2. 修改标签');
  console.log('3. 删除标签');
  console.log('4. 退出');
  console.log('═══════════════════════════════════════');
  
  const choice = await askQuestion('请选择操作 (1-4): ');
  
  switch (choice) {
    case '1':
      await showAllTags();
      await showMenu();
      break;
    case '2':
      await updateTagInteractive();
      await showMenu();
      break;
    case '3':
      await deleteTagInteractive();
      await showMenu();
      break;
    case '4':
      console.log('👋 再见！');
      rl.close();
      await prisma.$disconnect();
      process.exit(0);
      break;
    default:
      console.log('❌ 无效选择，请重新输入');
      await showMenu();
      break;
  }
}

// 启动程序
async function main() {
  try {
    console.log('🚀 欢迎使用数据库管理工具！');
    await showMenu();
  } catch (error) {
    console.error('❌ 程序执行失败:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// 运行程序
main();
