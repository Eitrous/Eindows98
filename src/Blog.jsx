import { useState, useMemo, memo } from 'react';
import { Button, Divider, ScrollView } from 'react95';
import ReactMarkdown from 'react-markdown'; // 1. 引入库
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { blogs } from './blogData';


function BlogApp() {
  const [selectedPost, setSelectedPost] = useState(null);

  // 3. 关键优化：使用 useMemo 缓存 Markdown 的组件配置
  // 这样 ReactMarkdown 就不会因为每次渲染都创建一个新的对象而误以为配置变了
  const markdownComponents = useMemo(
    () => ({
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <div
            style={{
              background: '#474747',
              padding: '10px',
              border: '2px solid',
              borderColor: '#808080 #ffffff #ffffff #808080',
              fontFamily: 'monospace',
              margin: '10px 0',
            }}>
            <SyntaxHighlighter
              style={{
                // 稍微优化一下样式，强制不用背景色，由外层 div 控制
                ...atomDark,
                'code[class*="language-"]': {
                  ...atomDark['code[class*="language-"]'],
                  background: 'transparent',
                },
                'pre[class*="language-"]': {
                  ...atomDark['pre[class*="language-"]'],
                  background: 'transparent',
                },
              }}
              language={match[1]}
              PreTag='div'
              {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code style={{ background: '#eee', padding: '2px 4px' }} {...props}>
            {children}
          </code>
        );
      },
      blockquote({ children }) {
        return (
          <div
            style={{
              borderLeft: '4px solid #000080',
              paddingLeft: '10px',
              color: '#666',
            }}>
            {children}
          </div>
        );
      },
    }),
    [],
  ); // 空依赖数组，表示这个配置永远不会变

  if (selectedPost) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '10px' }}>
          <Button onClick={() => setSelectedPost(null)} size='sm'>
            ⬅ 返回列表
          </Button>
        </div>

        <ScrollView
          style={{
            flex: 1,
            background: 'white',
            padding: '1rem',
          }}
          shadow={true}>
          <div style={{ padding: '1rem' }}>
            <h2 style={{ marginTop: 0, fontSize: '30px' }}>
              {selectedPost.title}
            </h2>
            <p style={{ color: '#888', fontSize: '13px' }}>
              发布于: {selectedPost.date}
            </p>
            <Divider />

            <div
              className='markdown-body'
              style={{ fontSize: '1.3rem', lineHeight: '1.6' }}>
              {/* 4. 使用缓存过的 components */}
              <ReactMarkdown components={markdownComponents}>
                {selectedPost.content}
              </ReactMarkdown>
            </div>
          </div>
        </ScrollView>
      </div>
    );
  }

  // 下面是列表部分，不需要修改
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={{ marginBottom: '0.5rem', fontSize: '14px' }}>
        共有 {blogs.length} 篇文章：
      </p>
      <ScrollView
        style={{
          flex: 1,
          background: 'white',
        }}>
        <div
          style={{
            padding: '0.5rem',
          }}>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {blogs.map((post) => (
              <li
                key={post.id}
                onClick={() => setSelectedPost(post)}
                style={{
                  cursor: 'pointer',
                  padding: '5px',
                  borderBottom: '1px dashed #ccc',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000080';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'black';
                }}>
                <span style={{ fontSize: '15px' }}>📄 {post.title}</span>
                <span>{post.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollView>
    </div>
  );
}

export default BlogApp;
