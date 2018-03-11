

// 播放按钮路径
const playPath = `
    M 20 10 l 30 20 l 0 40 l -30 20 
    M 50 30 l 30 20 l 0 0 l -30 20 z
`

// 暂停按钮路径
const pausePath = `
    M 20 10 l 20 0 l 0 80 l -20 0 
    M 60 10 l 20 0 l 0 80 l -20 0 z
`

// 全屏按钮路径
const fullPath = `
    M 10 10 h 30 v 8 h -22 v 22 h -8 
    M 10 60 v 30 h 30 v -8 h -22 v -22 
    M 60 82 h 22 v -22 h 8 v 30 h -30 
    M 60 10 h 30 v 30 h -8 v -22 h -22
`

// 音量调整按钮路径
const volumePath = `
    M494.592 191.488l-210.432 170.496c-12.8 10.24-28.672 16.384-45.568 16.384h-128c-12.8 0-24.064 10.24-24.064 24.064v240.64c0 12.8 10.24 24.064 24.064 24.064h128c16.896 0 32.768 5.632 45.568 16.384l210.432 170.496c15.36 12.8 38.912 1.536 38.912-18.432V209.92c0-19.968-23.552-31.232-38.912-18.432zM832.512 772.096l-45.568-41.472c57.344-62.464 88.576-144.384 88.576-228.864 0-83.456-30.72-164.352-86.528-226.816l46.08-40.96c66.048 73.728 102.4 168.96 102.4 267.776 0 99.84-37.376 196.608-104.96 270.336zM694.784 647.68l-45.568-41.984c26.112-28.16 40.448-65.024 40.448-104.448 0-37.888-13.824-73.728-38.4-101.888l46.592-40.96c34.304 39.424 53.76 89.6 53.76 142.336 0 55.808-20.48 107.52-56.832 146.944z
`

// Video 标签
const video = {
    el: 'video',
    ref: 'video'
}

// 控制条
const control = {
    el: 'div',
    ref: 'playerControls',
    attr: {
        className: 'splayer_controls'
    },
    children: [
        {
            el: 'div',  // 进度条
            attr: {
                className: 'splayer_speed'
            },
            ref: 'playerSpeed',
            children: [
                {
                    el: 'div',
                    attr: {
                        className: 'splayer_show_speed'
                    },
                    ref: 'speed'
                },{
                    // 预览图
                    el: 'div',
                    attr: {
                        className: 'splayer_preview'
                    },
                    ref: 'preview',
                    children: [
                        {
                            // 预览图片
                            el: 'img',
                            ref: 'previewImage'
                        },{
                            // 预览时间
                            el: 'span',
                            ref: 'previewTime'
                        }
                    ]
                }
            ]
        },{
            el: 'div',    // 控制块儿
            attr: {
                className: 'splayer_group',
            },
            children: [
                {
                    el:'svg',   // 播放暂停按钮
                    attr: {
                        className: 'splayer_button',
                        viewBox: '0 0 100 100'
                    },
                    ref: 'playerPlay',
                    children: [
                        {
                            el: 'path',
                            ref: 'playButtonPath',
                            attr: {
                                d: playPath
                            }
                        }
                    ]
                },{
                    el: 'div',
                    attr: {
                        className: 'splayer_volume'
                    },
                    children: [
                        {
                            el: 'svg',    // 音量调整按钮
                            attr: {
                                className: 'splayer_button splayer_show_volume',
                                viewBox: '0 0 1024 1024'
                            },
                            children: [
                                {
                                    el: 'path',
                                    attr: {
                                        d: volumePath
                                    }
                                }
                            ]
                        },{
                            el: 'div',    // 音量控制
                            attr: {
                                className: 'splayer_volume_bac'
                            },
                            ref: 'playerVolume',
                            children: [
                                {
                                    el: 'div',
                                    ref: 'volume',
                                    attr: {
                                        className: 'splayer_volume_speed'
                                    }
                                }
                            ]
                        }
                    ]
                },{
                    el: 'span',    // 播放进度时间
                    ref: 'time',
                    text: '00:00/00:00',
                    attr: {
                        className: 'splayer_time'
                    }
                },{
                    el:'svg',    // 全屏按钮
                    attr: {
                        className: 'splayer_button splayer_full',
                        viewBox: '0 0 100 100'
                    },
                    ref: 'playerFull',
                    children: [
                        {
                            el: 'path',
                            attr: {
                                d: fullPath
                            }
                        }
                    ]
                }
            ]
        }
    ]
}

// 蒙层
const layer = {
    el: 'div',
    attr: {
        className: 'splayer_layer'
    },
    children: [
        {
            // 加载中
            el: 'div',
            ref: 'playerLoading',
            attr: {
                className: 'splayer_loading'
            },
            children: [
                {
                    el: 'i',
                    attr: {
                        className: 'splayer_loading_i'
                    }
                },{
                    el: 'i',
                    attr: {
                        className: 'splayer_loading_i'
                    }
                }
            ]
        },{
            // 播放效果
            el: 'div',
            ref: 'playerLayerPlay',
            attr: {

                className: 'splayer_layer_play'
            },
            children: [
                {
                    el:'svg',
                    attr: {
                        viewBox: '0 0 100 100'
                    },
                    children: [
                        {
                            el: 'path',
                            ref: 'playerLayerPath'
                        }
                    ]
                }
            ]
        }
    ]
}

const DOM = {
    playPath,
    pausePath,
    fullPath,
    volumePath,
    video,
    control,
    layer
}

export default DOM

