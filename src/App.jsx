import React, { useState, useEffect } from 'react';
import './App.css';
import styled from 'styled-components';
import { Analytics } from '@vercel/analytics/react';
import { Rnd } from 'react-rnd';
import { createGlobalStyle } from 'styled-components';
import { styleReset } from 'react95';
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Toolbar,
  AppBar,
  MenuList,
  MenuListItem,
  Separator,
  Handle,
  Checkbox,
  Radio,
  TextField,
} from 'react95';
import CRTScreen from './CRTScreen';

/* 导入图标资产 */
import myComputerIcon from './assets/icon/myComputer.png';
import miniMyComputerIcon from './assets/icon/miniMyComputer.png';
import onlineNeighborIcon from './assets/icon/onlineNeighbor.png';
import miniOnlineNeighborIcon from './assets/icon/miniOnlineNeighbor.png';
import trashBinIcon from './assets/icon/trashBin.png';
import miniTrashBinIcon from './assets/icon/miniTrashBin.png';
import foldQIcon from './assets/icon/foldQ.png';
import miniFoldQIcon from './assets/icon/miniFoldQ.png';
import foldMQIcon from './assets/icon/foldMQ.png';
import miniFoldMQIcon from './assets/icon/miniFoldMQ.png';
import minimizeIcon from './assets/icon/minimize.png';
import maximizeIcon from './assets/icon/maximize.png';
import exitIcon from './assets/icon/exit.png';
import restoreIcon from './assets/icon/restore.png';
import shutdownIcon from './assets/icon/shutdown.png';
import startIcon from './assets/icon/start.png';

/* 导入程序 */
import MyComputerApp from './MyComputer';
import OnlineNeighborApp from './OnlineNeighbor';
import BlogApp from './Blog';
import NotesApp from './Notes';
import RecyclerApp from './Recycler';

// 定义一个只在悬浮时显示边框的按钮
const QuickLaunchButton = styled(Button)`
  width: 31px;
  height: 31px;
  min-width: 0; /* 覆盖 react95 默认的最小宽度 */
  padding: 0; /* 去掉内边距 */
  margin-right: 4px;
  margin-left: 4px;
  background: transparent !important; /* 平时背景透明 */
  box-shadow: none !important; /* 平时没有阴影 */
  border: 1px solid transparent !important; /* 平时边框透明，占位防止抖动 */

  /* 鼠标悬浮状态：恢复凸起效果 */
  &:hover {
    box-shadow:
      inset 1px 1px 0px 0px #ffffff,
      inset -1px -1px 0px 0px #0a0a0a,
      inset 2px 2px 0px 0px #dfdfdf,
      inset -2px -2px 0px 0px #808080 !important;
  }

  /* 鼠标按下状态：凹陷效果 */
  &:active {
    box-shadow:
      inset 1px 1px 0px 0px #0a0a0a,
      inset -1px -1px 0px 0px #ffffff,
      inset 2px 2px 0px 0px #808080,
      inset -2px -2px 0px 0px #dfdfdf !important;
  }

  /* 图标样式 */
  img {
    width: 24px;
    height: 24px;
    image-rendering: pixelated;
  }
`;

/* 程序列表 */
const APPLICATIONS = [
  {
    id: 'myComputer',
    title: '我的电脑',
    icon: myComputerIcon,
    miniIcon: miniMyComputerIcon,
    menu: true,
    bar: true,
  },
  {
    id: 'onlineNeighbor',
    title: '网上邻居',
    icon: onlineNeighborIcon,
    miniIcon: miniOnlineNeighborIcon,
    menu: true,
    bar: true,
  },
  {
    id: 'blog',
    title: '我的文档',
    icon: foldQIcon,
    miniIcon: miniFoldQIcon,
    menu: true,
    bar: false,
  },
  {
    id: 'notes',
    title: '笔记',
    icon: foldMQIcon,
    miniIcon: miniFoldMQIcon,
    menu: true,
    bar: false,
  },
  {
    id: 'recycler',
    title: '回收站',
    icon: trashBinIcon,
    miniIcon: miniTrashBinIcon,
    menu: false,
    bar: false,
  },
];

function App() {
  // 状态控制
  // 已选中的窗口列表
  // 记录当前被选中的图标 ID，如果没有选中则为 null
  const [selectedIconId, setSelectedIconId] = useState(null);
  // 已打开的窗口列表
  const [openedWindows, setOpenedWindows] = useState([]);
  // 层级计数器
  const [topZIndex, setTopZIndex] = useState(100);
  // 开始菜单状态
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  // 焦点所在窗口id
  const [focusedWindow, setFocusedWindow] = useState(null);
  // 开关crt
  const [crtOn, setCrtOn] = useState(true);
  // 关机
  const [isShuttingDown, setIsShuttingDown] = useState('0');
  // 关机弹窗
  const [showShutdownModal, setShowShutdownModal] = useState(false);
  // 关机选项
  const [shutdownOption, setShutdownOption] = useState('1');
  // 关机跳转网址
  const [redirectUrl, setRedirectUrl] = useState('');

  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const [currentTime, setCurrentTime] = useState(formatTime());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(formatTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 行为
  // 开关crt
  const handleCRT = () => {
    setCrtOn(!crtOn);
  };

  // 打开窗口
  const handleOpen = (app) => {
    const isAlreadyOpen = openedWindows.find((w) => w.id === app.id);
    if (isAlreadyOpen) {
      if (isAlreadyOpen.isMinimized) handleMinimize(app.id);
      bringToFront(app.id);
      return;
    }
    setFocusedWindow(app.id);
    const newWindows = {
      ...app,
      zIndex: topZIndex + 1,
      isMinimized: false,
      isMaximized: false,
      x: 50 + openedWindows.length * 30,
      y: 50 + openedWindows.length * 30,
      width: 900,
      height: 500,
      prevX: 0,
      prevY: 0,
      prevW: 0,
      prevH: 0,

      isDragging: false,
    };
    setOpenedWindows([...openedWindows, newWindows]);
    setTopZIndex(topZIndex + 1);
  };

  // 开始拖拽
  const handleDragStart = (id) => {
    bringToFront(id);
    setOpenedWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isDragging: true, dragDeltaX: 0, dragDeltaY: 0 }
          : w,
      ),
    );
  };

  const handleDrag = (id, d) => {
    setOpenedWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          // 计算当前 Rnd 的位置和原始位置的差值
          return {
            ...w,
            dragDeltaX: d.x - w.x,
            dragDeltaY: d.y - w.y,
          };
        }
        return w;
      }),
    );
  };

  // 关闭窗口
  const handleClose = (id) => {
    setOpenedWindows(openedWindows.filter((w) => w.id !== id));
    if (focusedWindow === id) setFocusedWindow(null);
  };

  // 点击“开始”
  const toggleStartMenu = () => {
    setStartMenuOpen(!startMenuOpen);
    setFocusedWindow(null);
  };

  // 点击开始菜单里的项
  const handleMenuClick = () => {
    setStartMenuOpen(false);
  };

  // 窗口置顶
  const bringToFront = (id) => {
    const newZIndex = topZIndex + 1;
    setTopZIndex(newZIndex);
    setFocusedWindow(id);
    setOpenedWindows(
      openedWindows.map((w) => {
        if (w.id === id) {
          return { ...w, zIndex: newZIndex };
        }
        return w;
      }),
    );
  };

  // 最小化
  const handleMinimize = (id) => {
    setOpenedWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w,
      ),
    );
  };

  // 最大化
  const handleMaximize = (id) => {
    const newZIndex = topZIndex + 1;
    setTopZIndex(newZIndex);
    setFocusedWindow(id);

    setOpenedWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          if (w.isMaximized) {
            return {
              ...w,
              isMaximized: false,
              x: w.prevX,
              y: w.prevY,
              width: w.prevW,
              height: w.prevH,
              zIndex: newZIndex,
            };
          } else {
            return {
              ...w,
              isMaximized: true,
              prevX: w.x,
              prevY: w.y,
              prevW: w.width,
              prevH: w.height,
              changed: true,
              x: 0,
              y: 0,
              width: window.innerWidth,
              height: window.innerHeight - 40,
              zIndex: newZIndex,
            };
          }
        }
        return w;
      }),
    );
  };

  // 监听浏览器窗口大小改变
  useEffect(() => {
    const handleResize = () => {
      setOpenedWindows((prev) =>
        prev.map((w) => {
          // 如果这个窗口处于最大化状态，就强制更新它的宽高为新的屏幕宽高
          if (w.isMaximized) {
            return {
              ...w,
              width: window.innerWidth,
              height: window.innerHeight - 40,
            };
          }
          return w;
        }),
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 更新位置和大小
  const updateWindowPos = (id, data) => {
    setOpenedWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              isDragging: false,
              x: data.x,
              y: data.y,
              dragDeltaX: 0,
              dragDeltaY: 0,
            }
          : w,
      ),
    );
  };

  const updateWindowSize = (id, ref, position) => {
    setOpenedWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              width: ref.style.width,
              height: ref.style.height,
              ...position,
            }
          : w,
      ),
    );
  };

  // 反色点阵框
  const GhostBorder = () => (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 999999,
        pointerEvents: 'none',

        mixBlendMode: 'difference',

        backgroundImage: `
          linear-gradient(90deg, white 50%, transparent 50%), 
          linear-gradient(90deg, white 50%, transparent 50%), 
          linear-gradient(0deg, white 50%, transparent 50%), 
          linear-gradient(0deg, white 50%, transparent 50%)
        `,
        backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',

        backgroundSize: '4px 2px, 4px 2px, 2px 4px, 2px 4px',
        backgroundPosition: '0 0, 0 100%, 0 0, 100% 0',
      }}
    />
  );

  // 关机弹窗
  const openShutdownModal = () => {
    setShowShutdownModal(true);
    setStartMenuOpen(false);
  };

  // 执行关机
  const executeShutdown = () => {
    setShowShutdownModal(false);

    let targetUrl = '';
    if (shutdownOption === '1') {
      targetUrl = 'https://0x-3f.com';
    } else if (shutdownOption === '2') {
      targetUrl = 'https://os.0x-3f.com';
    } else {
      targetUrl = 'https://dos.0x-3f.com';
    }

    setIsShuttingDown('1');

    if (shutdownOption === '1') {
        setTimeout(() => {
        setIsShuttingDown('2');
      }, 1000);
    }

    setTimeout(() => {
      window.location.href = targetUrl;
    }, 2000);
  };

  return (
    <div
      onClick={() => {
        setSelectedIconId(null);
        setFocusedWindow(null);
      }}
      style={{
        height: '100vh',
        background: '#008080',
        overflow: 'hidden',
      }}>
      {startMenuOpen && (
        <div
          onClick={() => {
            setStartMenuOpen(false);
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9998,
          }}
        />
      )}

      {/* 桌面图标 */}
      <div className='iconField'>
        {APPLICATIONS.map((app) => {
          const isSelected = selectedIconId === app.id;

          return (
            <div
              key={app.id}
              className='desktopIcon'
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIconId(app.id);
              }}
              onDoubleClick={() => handleOpen(app)}>
              <img
                src={app.icon}
                alt={app.title}
                className='icon'
                style={{
                  filter: isSelected
                    ? 'drop-shadow(2px 2px 0 rgba(0,0,128,0.5)) sepia(100%) hue-rotate(190deg) saturate(900%)'
                    : 'none',
                  opacity: isSelected ? 0.8 : 1,
                }}
              />

              <span
                className='appText'
                style={{
                  backgroundColor: isSelected ? '#000080' : 'transparent',
                  border: isSelected
                    ? '1px dotted #FFFF00'
                    : '1px solid transparent',
                  textShadow: isSelected ? 'none' : '1px 1px black',
                }}>
                {app.title}
              </span>
            </div>
          );
        })}
      </div>

      {openedWindows.map((window) => {
        const displayStyle = window.isMinimized
          ? { display: 'none' }
          : { display: 'flex' };
        const isDragging = window.isDragging;

        return (
          <Rnd
            key={window.id}
            size={{ width: window.width, height: window.height }}
            position={{ x: window.x, y: window.y }}
            onDragStart={() => handleDragStart(window.id)}
            onDrag={(e, d) => handleDrag(window.id, d)}
            onDragStop={(e, d) => updateWindowPos(window.id, d)}
            onResizeStop={(e, direction, ref, delta, position) =>
              updateWindowSize(window.id, ref, position)
            }
            onMouseDown={() => {
              bringToFront(window.id);
              setFocusedWindow(window.id);
            }}
            onClick={() => setFocusedWindow(window.id)}
            disableDragging={window.isMaximized}
            enableResizing={!window.isMaximized}
            bounds='parent'
            dragHandleClassName='window-title'
            style={{
              zIndex: window.zIndex,
              ...displayStyle,

              // outline: isDragging ? '2px dashed #000000' : 'none',

              background: 'transparent',
            }}>
            {isDragging && !window.isMaximized && <GhostBorder />}
            <Window
              className='window'
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                pointerEvents: isDragging ? 'none' : 'auto',

                transform: isDragging
                  ? `translate(${-window.dragDeltaX}px, ${-window.dragDeltaY}px)`
                  : 'none',

                transition: 'none',
              }}>
              <WindowHeader
                className='window-title'
                active={window.zIndex === topZIndex}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'default',
                }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px',
                  }}>
                  <img
                    src={window.icon}
                    style={{ height: '20px', marginRight: '5px' }}
                  />
                  {window.title}
                </span>
                <div style={{ display: 'flex' }}>
                  <Button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMinimize(window.id);
                    }}
                    size='sm'
                    square
                    style={{ marginRight: '2px' }}>
                    <span style={{ transform: 'translateY(-2px)' }}>
                      <img
                        src={minimizeIcon}
                        title='最小化'
                        className='controlIcon'
                      />
                    </span>
                  </Button>

                  <Button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMaximize(window.id);
                    }}
                    size='sm'
                    square
                    style={{ marginRight: '2px' }}>
                    <span>
                      <img
                        src={window.isMaximized ? restoreIcon : maximizeIcon}
                        title={window.isMaximized ? '恢复' : '最大化'}
                        className='controlIcon'
                      />
                    </span>
                  </Button>

                  <Button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose(window.id);
                    }}
                    size='sm'
                    square>
                    <span>
                      <img
                        src={exitIcon}
                        title='关闭'
                        className='controlIcon'
                      />
                    </span>
                  </Button>
                </div>
              </WindowHeader>

              <WindowContent
                style={{
                  flex: 1,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0.25rem',
                  position: 'relative',
                }}>
                {window.id === 'myComputer' && <MyComputerApp />}
                {window.id === 'onlineNeighbor' && <OnlineNeighborApp />}
                {window.id === 'blog' && <BlogApp />}
                {window.id === 'notes' && <NotesApp />}
                {window.id === 'recycler' && <RecyclerApp />}
              </WindowContent>
            </Window>
          </Rnd>
        );
      })}

      {/* 任务栏 */}
      <AppBar style={{ bottom: 0, top: 'auto', height: '40px', zIndex: 9999 }}>
        <Toolbar
          style={{
            justifyContent: 'space-between',
            height: '100%',
            padding: '0 4px',
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}>
            <Button
              onClick={toggleStartMenu}
              active={startMenuOpen}
              style={{
                height: '30px',
                fontWeight: 'normal',
                fontSize: '16px',
                alignItems: 'center',
              }}>
              <img src={startIcon} style={{ marginRight: '7px' }} />
              <span style={{ marginRight: '-2px' }}>开始</span>
            </Button>

            <Separator
              orientation='vertical'
              size='30px'
              className='barSeparator'
              style={{ marginLeft: '4px' }}
            />
            <Handle size={25} className='barSeparator' />

            {/* 开始菜单 */}
            {startMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  marginBottom: '4px',
                  display: 'flex',
                  background: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#ffffff #000000 #000000 #ffffff',
                  padding: '2px',
                  zIndex: 10000,
                }}>
                <div
                  style={{
                    width: '26px',
                    background: 'linear-gradient(to bottom, #000080, #000080)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                  <span
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '22px',
                      position: 'absolute',
                      bottom: '5px',
                      left: '31px',
                      transform: 'rotate(-90deg)',
                      transformOrigin: 'bottom left',
                      whiteSpace: 'nowrap',
                    }}>
                    <span
                      style={{
                        fontFamily: 'sans-serif',
                        fontWeight: '800',
                      }}>
                      Eindows
                    </span>
                    <span
                      style={{
                        fontFamily: 'sans-serif',
                        fontWeight: '300',
                        fontSize: '23px',
                        marginLeft: '1px',
                        marginTop: '0px',
                      }}>
                      ⑨8
                    </span>
                  </span>
                </div>

                <MenuList
                  style={{
                    boxShadow: 'none',
                    border: 'none',
                    padding: 0,
                  }}>
                  {/* 桌面应用 */}
                  {APPLICATIONS.map((app) => {
                    if (app.menu) {
                      return (
                        <MenuListItem
                          key={app.title}
                          onClick={() => {
                            handleMenuClick();
                            handleOpen(app);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            cursor: 'default',
                            padding: '5px 10px',
                          }}>
                          <span style={{ marginRight: '10px' }}>
                            <img
                              src={app.miniIcon}
                              style={{
                                height: '30px',
                                marginTop: '15px',
                                imageRendering: 'pixelated',
                              }}
                            />
                          </span>
                          <span style={{ textAlign: 'left', fontSize: '14px' }}>
                            {app.title}
                          </span>
                        </MenuListItem>
                      );
                    }
                  })}
                  <Separator />
                  {/* 其它应用 */}

                  {/* 特殊按键 */}

                  {/* CRT开关 */}
                  <span style={{ alignContent: 'center', height: '44px' }}>
                    <Checkbox
                      checked={crtOn}
                      onChange={handleCRT}
                      variant='flat'
                      style={{ marginLeft: '17px', marginTop: '10px' }}
                    />
                    <span style={{ marginLeft: '20px', fontSize: '14px' }}>
                      CRT
                    </span>
                  </span>

                  {/* 关机 */}
                  <MenuListItem
                    onClick={() => {
                      openShutdownModal();
                      handleMenuClick();
                    }}>
                    <img
                      src={shutdownIcon}
                      style={{
                        height: '30px',
                        marginTop: '2px',
                      }}
                    />
                    <span style={{ marginRight: '4px', fontSize: '14px' }}>
                      关闭系统
                    </span>
                  </MenuListItem>
                </MenuList>
              </div>
            )}
          </div>
          {/* 固定应用 */}

          {APPLICATIONS.map((app) => {
            if (app.bar) {
              return (
                <QuickLaunchButton
                  key={app.id}
                  variant='flat'
                  title={app.title}
                  onClick={() => handleOpen(app)}>
                  <img src={app.miniIcon} alt={app.title} />
                </QuickLaunchButton>
              );
            }
          })}

          <Separator
            orientation='vertical'
            size='30px'
            className='barSeparator'
            style={{ marginLeft: '4px' }}
          />
          <Handle size={25} className='barSeparator' />

          <div
            style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
              alignItems: 'center',
              height: '100%',
            }}>
            {/* 任务栏按钮 */}
            {openedWindows.map((window) => {
              return (
                <Button
                  key={window.id}
                  active={!window.isMinimized && window.zIndex === topZIndex}
                  onClick={() => {
                    if (window.isMaximized) {
                      handleMinimize(window.id);
                      bringToFront(window.id);
                    } else {
                      if (window.zIndex === topZIndex) {
                        handleMinimize(window.id);
                      } else {
                        bringToFront(window.id);
                      }
                    }
                  }}
                  style={{
                    fontWeight: 'bold',
                    height: '32px',
                    marginRight: '4px',
                    justifyContent: 'flex-start',

                    flex: 1,
                    maxWidth: '150px',
                    minWidth: '0',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}>
                  <img
                    src={window.miniIcon}
                    style={{
                      height: '25px',
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                      textAlign: 'left',
                    }}>
                    {window.title}
                  </span>
                </Button>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Separator
              orientation='vertical'
              size='30px'
              className='barSeparator'
              style={{ marginLeft: '4px', marginRight: '4px' }}
            />

            {/* 时间 */}
            <Button
              variant='flat'
              disabled
              style={{
                height: '30px',
                fontSize: '16px',
                fontWeight: 'lighter',
              }}>
              {currentTime}
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* 关机确认弹窗 */}
      {showShutdownModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Window style={{ width: '500px', height: '250px' }}>
            <WindowHeader
              className='window-title'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <span style={{ marginLeft: '3px', fontSize: '16px' }}>
                关闭 Eindows
              </span>
              <Button
                onClick={() => setShowShutdownModal(false)}
                style={{ marginTop: '0px', marginRight: '-2px' }}
                size='sm'
                square>
                <img className='controlIcon' src={exitIcon} />
              </Button>
            </WindowHeader>

            <WindowContent>
              <div
                style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <img
                  src={shutdownIcon}
                  alt='shutdown'
                  style={{
                    width: '48px',
                    height: '48px',
                    imageRendering: 'pixelated',
                  }}
                />

                <div>
                  <div style={{ marginBottom: '15px', fontSize: '16px' }}>
                    确实要：
                  </div>

                  <Radio
                    checked={shutdownOption === '1'}
                    onChange={() => setShutdownOption('1')}
                    value='1'
                    label='关闭计算机'
                    name='shutdown-group'
                    style={{ marginBottom: '1px', fontSize: '16px' }}
                  />
                  <br />
                  <Radio
                    checked={shutdownOption === '2'}
                    onChange={() => setShutdownOption('2')}
                    value='2'
                    label='重新启动计算机'
                    name='shutdown-group'
                    style={{ marginBottom: '1px', fontSize: '16px' }}
                  />
                  <br />
                  <Radio
                    checked={shutdownOption === '3'}
                    onChange={() => setShutdownOption('3')}
                    value='3'
                    label='重新启动计算机并切换到 ES-DOS 方式'
                    name='shutdown-group'
                    style={{ marginBottom: '0px', fontSize: '16px' }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '-8px',
                }}>
                <Button
                  onClick={executeShutdown}
                  style={{ width: '120px', height: '32px', fontSize: '16px' }}>
                  是(Y)
                </Button>
                <Button
                  onClick={() => setShowShutdownModal(false)}
                  style={{ width: '120px', height: '32px', fontSize: '16px' }}>
                  否(N)
                </Button>
              </div>
            </WindowContent>
          </Window>
        </div>
      )}

      {/* 黑屏 */}
      {isShuttingDown === '1' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            zIndex: 999999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'none',
          }}
        />
      )}
      {isShuttingDown === '2' && shutdownOption === '1' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            zIndex: 999999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'none',
          }}>
          <span
            style={{
              color: '#996521',
              fontFamily: "'KaiTi', 'STKaiti', '楷体', serif",
              fontSize: `${window.innerWidth / 25}px`,
              fontWeight: 'bold',
              letterSpacing: '10px',

              display: 'inline-block', // transform 需要元素是块级或行内块级才能生效
              transform: 'scale(1.2, 0.7)', // X轴拉长到1.2倍，Y轴压扁到0.7倍
              transformOrigin: 'center',

              textShadow: '0 0 1px #ffb000',
            }}>
            现在可以安全地关闭计算机了
          </span>
        </div>
      )}
      {crtOn && <CRTScreen />}
      <Analytics />
    </div>
  );
}

export default App;
