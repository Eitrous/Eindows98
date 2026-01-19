import React, { useState } from 'react';
import { Button, Cutout, Divider } from 'react95';
import ReactMarkdown from 'react-markdown'; // 1. 引入库
import { blogs } from './blogData';

function BlogApp() {
  const [selectedPost, setSelectedPost] = useState(null);

  if (selectedPost) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '10px' }}>
          <Button onClick={() => setSelectedPost(null)} size="sm">
            ⬅ 返回列表
          </Button>
        </div>

        <Cutout style={{ flex: 1, background: 'white', padding: '1rem', overflowY: 'auto' }}>
          {/* 文章标题 */}
          <h2 style={{ marginTop: 0, fontSize: '30px' }}>{selectedPost.title}</h2>
          <p style={{ color: '#888', fontSize: '13px' }}>发布于: {selectedPost.date}</p>
          <Divider />
          
          {/* 2. 使用 ReactMarkdown 渲染内容 */}
          {/* 我们包了一层 div 来控制字体样式 */}
          <div className="markdown-body" style={{ fontSize: '1.3rem', lineHeight: '1.6' }}>
            <ReactMarkdown 
              components={{
                // 3. 自定义渲染：我们要拦截 Markdown 里的元素，加上 Win98 的样式
                
                // 让代码块看起来像 DOS 命令行或记事本
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline ? (
                    <div style={{ 
                        background: '#c0c0c0', // 灰色背景
                        padding: '10px', 
                        border: '2px solid', 
                        borderColor: '#808080 #ffffff #ffffff #808080', // 凹陷效果
                        fontFamily: 'monospace',
                        margin: '10px 0'
                    }}>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </div>
                  ) : (
                    <code style={{ background: '#eee', padding: '2px 4px' }} {...props}>
                      {children}
                    </code>
                  )
                },
                // 让引用块看起来稍微特别一点
                blockquote({children}) {
                  return (
                    <div style={{ borderLeft: '4px solid #000080', paddingLeft: '10px', color: '#666' }}>
                      {children}
                    </div>
                  )
                }
              }}
            >
              {selectedPost.content}
            </ReactMarkdown>
          </div>

        </Cutout>
      </div>
    );
  }

  // 下面是列表部分，不需要修改
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={{ marginBottom: '0.5rem', fontSize: '14px' }}>共有 {blogs.length} 篇文章：</p>
      <Cutout style={{ flex: 1, background: 'white', padding: '0.5rem', overflowY: 'auto' }}>
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
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'black'; }}
            >
              <span style={{ fontSize: '15px' }}>📄 {post.title}</span>
              <span>{post.date}</span>
            </li>
          ))}
        </ul>
      </Cutout>
    </div>
  );
}

export default BlogApp;