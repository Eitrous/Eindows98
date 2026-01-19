import matter from 'gray-matter';
import { Buffer } from 'buffer';

// 解决浏览器环境没有 Buffer 的问题
window.Buffer = Buffer;

// 1. 让 Vite 自动扫描 ./posts 目录下所有的 .md 文件
// { as: 'raw' } 表示以纯文本字符串形式读取
// { eager: true } 表示直接加载，不要懒加载（方便我们在组件里直接用）
const modules = import.meta.glob('./BlogPosts/*.md', { as: 'raw', eager: true });

// 2. 将扫描到的对象转换成我们需要的数据数组
export const blogs = Object.keys(modules).map((path) => {
  // path 类似于 "./posts/my-first-post.md"
  const rawContent = modules[path];
  
  // 使用 gray-matter 解析 Frontmatter (--- ... --- 里的内容)
  const { data, content } = matter(rawContent);

  return {
    // 自动生成一个 ID (用文件名做 ID)
    id: path,
    // 读取 yaml 头里的 title，如果没有就显示“无标题”
    title: data.title || '无标题',
    // 读取 yaml 头里的 date
    date: data.date ? String(data.date) : '未知日期',
    // 正文内容
    content: content
  };
});

// 可选：按日期倒序排列（最新的在最上面）
blogs.sort((a, b) => new Date(b.date) - new Date(a.date));