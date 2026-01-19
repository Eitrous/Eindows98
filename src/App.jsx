import React, { useState, useEffect } from 'react';
import './App.css';
import styled from 'styled-components';
import { Analytics } from "@vercel/analytics/react"
import { Rnd } from 'react-rnd';
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
  TextInput,
  TextField,
} from 'react95';

/* 导入图标资产 */
import myComputerIcon from './assets/icon/myComputer.png';
import onlineNeighborIcon from './assets/icon/onlineNeighbor.png';
import trashBinIcon from './assets/icon/trashBin.png';
import foldQIcon from './assets/icon/foldQ.png';
import foldMQIcon from './assets/icon/foldMQ.png';
import minimizeIcon from './assets/icon/minimize.png';
import maximizeIcon from './assets/icon/maximize.png';
import exitIcon from './assets/icon/exit.png';
import restoreIcon from './assets/icon/restore.png';
import pointerIcon from './assets/icon/pointer.png';

/* 导入程序 */
import MyComputerApp from './MyComputer';
import OnlineNeighborApp from './OnlineNeighbor';
import BlogApp from './Blog';
import NotesApp from './Notes';
import RecyclerApp from './Recycler';
import { shadow } from 'react95/dist/common';

/* 程序列表 */
const APPLICATIONS = [
  {
    id: 'myComputer',
    title: '我的电脑',
    icon: myComputerIcon,
    menu: true,
  },
  {
    id: 'onlineNeighbor',
    title: '网上邻居',
    icon: onlineNeighborIcon,
    menu: true,
  },
  {
    id: 'blog',
    title: '我的文档',
    icon: foldQIcon,
  },
  {
    id: 'notes',
    title: '笔记',
    icon: foldMQIcon,
    menu: true,
  },
  {
    id: 'recycler',
    title: '回收站',
    icon: trashBinIcon,
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
      prev.map((w) => (w.id === id ? { ...w, isDragging: true } : w)),
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
            };
          } else {
            return {
              ...w,
              isMaximized: true,
              prevX: w.x,
              prevY: w.y,
              prevW: w.width,
              prevH: w.height,

              x: 0,
              y: 0,
              width: window.innerWidth,
              height: window.innerHeight - 50,
            };
          }
        }
        return w;
      }),
    );
    bringToFront(id);
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
              height: window.innerHeight - 50,
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

  // 关机，跳转到正常页面
  const shutDown = () => {

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

      {/* 渲染窗口 */}
      {openedWindows.map((window) => {
        const displayStyle = window.isMinimized
          ? { display: 'none' }
          : { display: 'flex' };

        return (
          <React.Fragment key={window.id}>
            {window.isDragging && !window.isMaximized && (
              <div
                style={{
                  position: 'absolute',
                  left: window.x,
                  top: window.y,
                  width: window.width,
                  height: window.height,
                  zIndex: window.zIndex - 1,
                  ...displayStyle,
                }}>
                <Window className='window'>
                  <WindowHeader className='window-title'>
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '16px'}}>
                      <span style={{ marginRight: '5px' }}>
                        <img
                          src={window.icon}
                          style={{
                            height: '25px',
                            marginTop: '10px',
                          }}
                        />
                      </span>
                      {window.title}
                    </span>
                    <div style={{ display: 'flex' }}>
                      <Button
                        disabled
                        size={'sm'}
                        square
                        style={{ marginRight: '2px', marginTop: '1px' }}>
                        <img
                          src={minimizeIcon}
                          alt='最小化'
                          title='最小化'
                          className='controlIcon'
                        />
                      </Button>

                      <Button
                        disabled
                        size={'sm'}
                        square
                        style={{ marginRight: '2px', marginTop: '1px' }}>
                        <img
                          src={window.isMaximized ? restoreIcon : maximizeIcon}
                          alt={window.isMaximized ? '恢复' : '最大化'}
                          title={window.isMaximized ? '恢复' : '最大化'}
                          className='controlIcon'
                        />
                      </Button>

                      <Button
                        disabled
                        size={'sm'}
                        square
                        style={{ marginTop: '1px' }}>
                        <img
                          src={exitIcon}
                          alt='关闭'
                          title='关闭'
                          className='controlIcon'
                        />
                      </Button>
                    </div>
                  </WindowHeader>
                  <WindowContent
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                    {window.id === 'myComputer' && <MyComputerApp />}
                    {window.id === 'onlineNeighbor' && <OnlineNeighborApp />}
                    {window.id === 'blog' && <BlogApp />}
                    {window.id === 'notes' && <NotesApp />}
                    {window.id === 'recycler' && <RecyclerApp />}
                  </WindowContent>
                </Window>
              </div>
            )}

            {/* 虚线框 */}
            <Rnd
              size={{
                width: window.width,
                height: window.height,
              }}
              position={{
                x: window.x,
                y: window.y,
              }}
              onDragStart={() => handleDragStart(window.id)}
              onDragStop={(e, d) => updateWindowPos(window.id, d)}
              onResizeStop={(e, direction, ref, delta, position) =>
                updateWindowSize(window.id, ref, position)
              }
              onMouseDown={() => {
                bringToFront(window.id);
                setFocusedWindow(window.id);
              }}
              onClick={() => {
                setFocusedWindow(window.id);
              }}
              disableDragging={window.isMaximized}
              enableResizing={!window.isMaximized}
              bounds='parent'
              dragHandleClassName='window-title'
              style={{
                zIndex: window.zIndex,
                ...displayStyle,
                outline: window.isDragging ? '2px dashed black' : 'none',

                background: 'transparent',
                pointerEvents: window.isDragging ? 'none' : 'auto',
              }}>
              {!window.isDragging && (
                <Window className='window'>
                  <WindowHeader 
                    className='window-title' 
                    active={ window.zIndex === topZIndex }
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '16px'
                      }}>
                      <span style={{ marginRight: '5px' }}>
                        <img
                          src={window.icon}
                          style={{
                            height: '25px',
                            marginTop: '10px',
                          }}
                        />
                      </span>
                      {window.title}
                    </span>
                    <div style={{ display: 'flex' }}>
                      <Button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMinimize(window.id);
                        }}
                        style={{
                          marginRight: '2px',
                          marginTop: '1px',
                        }}
                        size={'sm'}
                        square>
                        <img
                          src={minimizeIcon}
                          alt='最小化'
                          title='最小化'
                          className='controlIcon'
                        />
                      </Button>

                      <Button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMaximize(window.id);
                        }}
                        style={{
                          marginRight: '2px',
                          marginTop: '1px',
                        }}
                        size={'sm'}
                        square>
                        <img
                          src={window.isMaximized ? restoreIcon : maximizeIcon}
                          alt={window.isMaximized ? '恢复' : '最大化'}
                          title={window.isMaximized ? '恢复' : '最大化'}
                          className='controlIcon'
                        />
                      </Button>

                      <Button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClose(window.id);
                        }}
                        style={{ marginTop: '1px' }}
                        size={'sm'}
                        square>
                        <img
                          src={exitIcon}
                          alt='关闭'
                          title='关闭'
                          className='controlIcon'
                        />
                      </Button>
                    </div>
                  </WindowHeader>

                  <WindowContent
                    onMouseDown={() => {
                      bringToFront(window.id);
                      setFocusedWindow(window.id);
                    }}
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                    {window.id === 'myComputer' && <MyComputerApp />}
                    {window.id === 'onlineNeighbor' && <OnlineNeighborApp />}
                    {window.id === 'blog' && <BlogApp />}
                    {window.id === 'notes' && <NotesApp />}
                    {window.id === 'recycler' && <RecyclerApp />}
                  </WindowContent>
                </Window>
              )}
            </Rnd>
          </React.Fragment>
        );
      })}

      {/* 任务栏 */}
      <AppBar style={{ bottom: 0, top: 'auto', height: '40px', zIndex: 9999 }}>
        <Toolbar style={{ justifyContent: 'space-between', height: '100%', padding: '0 4px' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Button
              onClick={toggleStartMenu}
              active={startMenuOpen}
              style={{
                height: '32px',
                fontWeight: 'normal',
                fontSize: '16px',
              }}
            >
              <span style={{ marginRight: '4px' }}>🏁</span>开始
            </Button>
            <Separator orientation= 'vertical' size='30px' className='barSeparator' style={{ marginLeft: '4px', marginRight: '4px' }} />

            {/* 固定应用 */}
            
            <Separator orientation= 'vertical' size='30px' className='barSeparator' style={{ marginLeft: '4px', marginRight: '4px' }} />

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
                }}
              >
                <div
                  style={{
                    width: '26px',
                    background: 'linear-gradient(to bottom, #000080, #000080)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
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
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'sans-serif',
                        fontWeight: '800',
                      }}
                    >
                      Eindows
                    </span>
                    <span
                      style={{
                        fontFamily: 'sans-serif',
                        fontWeight: '300',
                        fontSize: '23px',
                        marginLeft: '1px',
                        marginTop: '0px'
                      }}
                    >
                      ⑨8
                    </span>
                  </span>
              </div>

              <MenuList
                style={{
                  boxShadow: 'none',
                  border: 'none',
                  padding: 0.
                }}
              >

                {/* 桌面应用 */}
                {APPLICATIONS.map(app => {
                  if (app.menu) {
                    return (
                      <>
                        <MenuListItem
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
                          }}
                        >
                          <span style={{ marginRight: '10px' }}>
                            <img
                              src={app.icon}
                              style={{
                                height: '30px',
                                marginTop: '15px'
                              }}
                            />
                          </span>
                          <span style={{ textAlign: 'left' }}>
                            {app.title}
                          </span>
                        </MenuListItem>
                      </>
                    );
                  }
                })}
                <Separator />
                {/* 其它应用 */}

                {/* 特殊按键 */}
                <MenuListItem
                  onClick={() => {
                    shutDown();
                    handleMenuClick();
                  }}
                >
                  <span style={{ marginRight: '10px' }}>
                    🏁
                  </span>
                  关闭系统
                </MenuListItem>
              </MenuList>
            </div>
          )}

          {/* 任务栏按钮 */}
          {openedWindows.map((window) => (
            <Button
              key={window.id}
              active={!window.isMinimized && window.zIndex === topZIndex}
              onClick={() => {
                if (window.isMaximized) {
                  handleMinimize(window.id);
                  bringToFront(window.id);
                }
                else {
                  if (window.zIndex === topZIndex) {
                    handleMinimize(window.id);
                  }
                  else {
                    bringToFront(window.id);
                  }
                }
              }
            }
            style={{
              fontWeight: 'bold',
              height: '32px',
              marginRight: '4px',
              minWidth: '180px',
              maxWidth: '200px',
              justifyContent: 'flex-start',
            }}
          >
            <span style={{ marginRight: '4px' }}>
              <img
                src={window.icon}
                style={{
                  height: '25px',
                }}
              />
            </span>
            {window.title.length > 6 ? window.title.substring(0, 6) + '...' : window.title}
          </Button>
          ))}
          
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Separator orientation='vertical' size='30px' className='barSeparator' style={{ marginLeft: '4px', marginRight: '4px' }} />
          <Button 
            variant='flat'
            disabled
            style={{
              height: '30px',
              fontSize: '16px',
              fontWeight: 'lighter'
            }}
          >
            {currentTime}
          </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
