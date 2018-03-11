

import DOM   from './dom'
import Farme from './farme'

// 定义renderDOM的参数约束
interface RenderDOM {
    readonly el: string
    readonly ref?: string
    readonly text?: string
    readonly attr?: {
        [index: string]: string
    }
    readonly event?: {
        [index: string]: (...args: any[]) => any
    }
    readonly children?: RenderDOM[]
}

class Control{
    
    public el: HTMLDivElement
    public duration: number
    public refs: {

        // video
        video?          : HTMLVideoElement

        // 控制条
        playerControls? : HTMLDivElement
        volume?         : HTMLDivElement
        speed?          : HTMLDivElement
        time?           : HTMLSpanElement
        playButtonPath? : SVGPathElement
        preview?        : HTMLDivElement
        previewImage?   : HTMLImageElement
        previewTime?    : HTMLSpanElement
        playerSpeed?    : HTMLDivElement
        playerPlay?     : SVGAElement
        playerFull?     : SVGAElement
        playerVolume?   : HTMLDivElement

        // 蒙层
        playerLoading?  : HTMLDivElement
        playerLayerPlay?: HTMLDivElement
        playerLayerPath?: SVGPathElement

    }
    private farme: any
    private seekingTimer: any

    // Init
    constructor(option) {

        this.el = document.querySelector(option.el)
        this.el.classList.add('splayer')

        this.duration = 0                               // 视频总时间
        this.refs = { }                                 // 用来存放 render ref的DOM标签
        this.createVideo(option.poster,option.src)      // 创建视频标签
        this.createDOM()                                // 创建DOM
        this.createEvevt()                              // 创建视频的各种事件
        this.farme = null                               // 截取视频帧
        this.seekingTimer = null                        // 如果加载不超过300ms那么不显示加载中样式

    }

    // 创建DOM
    renderDOM(node: RenderDOM): HTMLElement | SVGElement {

        let vNode: HTMLElement | SVGElement

        // 兼容SVG的创建
        if(node.el === 'svg' || node.el === 'path'){
            vNode = document.createElementNS('http://www.w3.org/2000/svg',node.el)
        }else{
            vNode = document.createElement(node.el)
        }

        //  把需要用到的dom绑定到 this上
        node.ref && (this.refs[node.ref] = vNode)

        node.text !== undefined && vNode.appendChild(
            document.createTextNode(node.text)
        )

        for(let x in node.attr){
            if(node.attr[x] !== undefined){
                let key = x === 'className' ? 'class' : x
                vNode.setAttribute(key,node.attr[x])
            }
        }

        for(let envName in node.event){
            vNode.addEventListener(envName,node.event[envName],false)
        }

        // 子节点
        node.children && node.children.forEach(item => {
            vNode.appendChild(this.renderDOM(item))
        })

        return vNode

    }

    // 创建视频
    createVideo(poster: string, src: string): void {

        let video = <HTMLVideoElement> this.renderDOM(DOM.video)
        video.poster   = poster
        video.src      = src
        video.controls = false
        this.el.appendChild(video)
        this.refs.video.load()

    }

    // 创建DOM
    createDOM(): void {

        // 蒙层
        this.el.appendChild(this.renderDOM(DOM.layer))
        // 控制条
        this.el.appendChild(this.renderDOM(DOM.control))

    }

    // 添加操作事件
    createEvevt(): void {

        // 开始查找数据
        this.refs.video.addEventListener('loadstart',() => {
            this.farme = new Farme(this.refs.video)
        })

        // 获取到视频长度
        this.refs.video.addEventListener('loadedmetadata',() => {
            this.duration = (<HTMLVideoElement> event.target).duration
            this.updateCurrentTime(0)
        })

        // 视频长度改变
        this.refs.video.addEventListener('durationchange',() => {
            this.duration = (<HTMLVideoElement> event.target).duration
            this.updateCurrentTime((<HTMLVideoElement> event.target).currentTime)
        })

        // 更新视频时间
        this.refs.video.addEventListener('timeupdate',() => {
            this.updateCurrentTime((<HTMLVideoElement> event.target).currentTime)
        })

        // 视频播放结束
        this.refs.video.addEventListener('ended',() => this.setPlayState(false))

        // 视频被播放
        this.refs.video.addEventListener('play',() => this.setPlayState(true))

        // 视频被暂停
        this.refs.video.addEventListener('pause',() => this.setPlayState(false))

        // 视频音量大小被调整
        this.refs.video.addEventListener('volumechange',() => {
            this.updateVolume((<HTMLVideoElement> event.target).volume)
        })

        // 控制音量
        this.refs.playerVolume.addEventListener('click',(event: MouseEvent) => {
            this.refs.video.volume = event.offsetX / (<HTMLDivElement> event.currentTarget).offsetWidth
        })

        // 点击进入全屏
        this.refs.playerFull.addEventListener('click',() => {
            if(document.webkitFullscreenElement) {
                document.webkitCancelFullScreen()
            }else {
                this.el.webkitRequestFullScreen()
            }
        })

        // 视频开始寻找加载中
        this.refs.video.addEventListener('seeking',() => this.setLoading(true))

        // 视频寻找完毕
        this.refs.video.addEventListener('seeked',() => this.setLoading(false))

        // 等待视频数据
        this.refs.video.addEventListener('waiting',() => this.setLoading(true))

        // 等待完成
        this.refs.video.addEventListener('canplay',() => this.setLoading(false))

        // 点击进度条跳到指定位置
        this.refs.playerSpeed.addEventListener('click',(event: MouseEvent) => {
            let curTime = this.duration * (event.offsetX / (<HTMLDivElement> event.currentTarget).offsetWidth)
            this.updateCurrentTime(curTime)
            setTimeout(() => {
                this.refs.video.currentTime = curTime
            }, 0)
        })

        // 鼠标经过进度条显示预览图
        this.refs.playerSpeed.addEventListener('mousemove',(event: MouseEvent) =>  this.setFarme(event))

        // 点击按钮 播放/暂停
        this.refs.playerPlay.addEventListener('click',() => {
            this.refs.playerLayerPlay.style.display = 'block'
            if(this.refs.video.paused) {
                this.refs.video.play()
                this.refs.playerLayerPath.setAttribute('d',DOM.playPath)
            }else {
                this.refs.video.pause()
                this.refs.playerLayerPath.setAttribute('d',DOM.pausePath)
                this.setLoading(false)
            }
        })
        
        // 点击播放暂停弹出动画结束后隐藏
        this.refs.playerLayerPlay.addEventListener('animationend',() => {
            (<HTMLDivElement> event.target).style.display = 'none'
        })

        // 鼠标移入
        this.el.addEventListener('mouseover',() => {
            this.refs.playerControls.classList.remove('splayer_controls_hide')
        })

        // 鼠标移出
        this.el.addEventListener('mouseout',() => {
            if(!this.refs.video.paused) {
                this.refs.playerControls.classList.add('splayer_controls_hide')
            }
        })

    }

    // 更新当前播放时间的DOM
    updateCurrentTime(time: number): void {
        this.refs.speed.style.width = (time / this.duration * 100).toFixed(4) + '%'
        this.refs.time.innerHTML = this.secToMin(time) + '/' + this.secToMin(this.duration)
    }

    // 更新音量的DOM
    updateVolume(volume: number): void {
        this.refs.volume.style.width = volume * 100 + '%'
    }

    // 播放暂停
    setPlayState(state: boolean): void {
        this.refs.playButtonPath.setAttribute('d',state ? DOM.pausePath : DOM.playPath)
    }

    // 加载中
    setLoading(state: boolean): void {

        window.clearTimeout(this.seekingTimer)
        if(state){
            this.seekingTimer = setTimeout(() => {
                this.refs.playerLoading.style.display = 'flex'
            },300)
        }else{
            this.refs.playerLoading.style.display = 'none'
        }
        
    }

    // 秒数转成时间
    secToMin(sec: number): string {
        let m: string = Math.floor(sec / 60).toString()
        let s: string = Math.floor(sec % 60).toString()
        m = m.length === 1 ? '0' + m : m
        s = s.length === 1 ? '0' + s : s
        return `${ m }:${ s }`
    }

    // 鼠标经过进度条显示预览缩略图
    setFarme(event: MouseEvent): void {
        // 预览图跟随鼠标移动
        let left: number    = event.offsetX - this.refs.preview.offsetWidth / 2
        let maxLeft: number = (<HTMLDivElement> event.target).offsetWidth - this.refs.preview.offsetWidth
        left = left < 0 ? 0 : left > maxLeft ? maxLeft : left
        this.refs.preview.style.left = left + 'px'
        // 目标时间点
        let time:number = Math.floor(event.offsetX / (<HTMLDivElement> event.target).offsetWidth * this.duration) 
        this.refs.previewTime.innerHTML = this.secToMin(time)
        this.farme.getFarme(time).then(imgURL =>  this.refs.previewImage.src = imgURL )
    }

}

export default Control

