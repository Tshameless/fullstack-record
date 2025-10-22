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

// 添加单个标签的交互式函数
async function addTagInteractive() {
  try {
    console.log('\n🏷️  添加新标签');
    console.log('═══════════════════════════════════════');
    
    const name = await askQuestion('标签名称: ');
    if (!name) {
      console.log('❌ 标签名称不能为空');
      return;
    }
    
    const slug = await askQuestion('标签标识 (slug): ');
    if (!slug) {
      console.log('❌ 标签标识不能为空');
      return;
    }
    
    const description = await askQuestion('标签描述 (可选): ');
    const color = await askQuestion('标签颜色 (可选，如 #FF0000): ');
    
    // 检查 slug 是否已存在
    const existing = await prisma.tag.findUnique({
      where: { slug }
    });
    
    if (existing) {
      console.log(`❌ 标签标识 "${slug}" 已存在`);
      return;
    }
    
    // 创建标签
    const newTag = await prisma.tag.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || null
      }
    });
    
    console.log('✅ 标签添加成功！');
    console.log(`   ID: ${newTag.id}`);
    console.log(`   名称: ${newTag.name}`);
    console.log(`   标识: ${newTag.slug}`);
    console.log(`   描述: ${newTag.description || '无'}`);
    console.log(`   颜色: ${newTag.color || '无'}`);
    
  } catch (error) {
    console.error('❌ 添加标签失败:', error.message);
  }
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
      console.log(`${index + 1}. ${tag.name} (${tag.slug})`);
      if (tag.description) console.log(`   描述: ${tag.description}`);
      if (tag.color) console.log(`   颜色: ${tag.color}`);
      console.log(`   创建时间: ${tag.createdAt.toLocaleString()}`);
      console.log('   ───────────────────────────────────────');
    });
    
  } catch (error) {
    console.error('❌ 获取标签列表失败:', error.message);
  }
}

// 主菜单
async function showMenu() {
  console.log('\n🎯 数据库标签管理工具');
  console.log('═══════════════════════════════════════');
  console.log('1. 添加新标签');
  console.log('2. 查看所有标签');
  console.log('3. 退出');
  console.log('═══════════════════════════════════════');
  
  const choice = await askQuestion('请选择操作 (1-3): ');
  
  switch (choice) {
    case '1':
      await addTagInteractive();
      await showMenu();
      break;
    case '2':
      await showAllTags();
      await showMenu();
      break;
    case '3':
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
    console.log('🚀 欢迎使用数据库标签管理工具！');
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
