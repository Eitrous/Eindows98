import { ProgressBar } from 'react95';
import React, { useEffect, useState } from 'react';

function NotesApp() {
  const [percent, setPercent] = useState(0);

  const [warning, setWarning] = useState(false);

  const [solution, setSolution] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((previousPercent) => {
        if (previousPercent === 100) {
          setWarning(true);
          setTimeout(() => {
            setSolution(true);
          }, 2000);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(previousPercent + diff, 100);
      });
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      style={{ width: '100%', height: '100%', alignContent: 'space-around' }}>
      <ProgressBar value={Math.floor(percent)} variant='tile' />

      <div
        style={{
          height: '40px',
          fontSize: '20px',
        }}>
        {warning ? (
            <p>加载失败：笔记过长，占用性能</p>
        ) : '加载中...'}
        {solution && (
            <p>解决方法：关机</p>
        )}
      </div>
    </div>
  );
}

export default NotesApp;
