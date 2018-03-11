

class Farme {

    private video: HTMLVideoElement
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private imageHeight: number
    private imageWidth: number
    private previewURL: Array <{
        sec: number
        url: string
    }>

    // Init
    constructor(videoELement: HTMLVideoElement) {

        this.video     = document.createElement('video')
        this.video.src = videoELement.src

        // CORS
        this.video.setAttribute('crossOrigin','anonymous')
        this.video.load()
        this.canvas      = document.createElement('canvas')
        this.ctx         = this.canvas.getContext('2d')
        this.imageHeight = this.canvas.height = videoELement.offsetHeight
        this.imageWidth  = this.canvas.width  = videoELement.offsetWidth
        this.previewURL  = []

    }

    // 截取视频帧
    getFarme(time: number): Promise <string> {

        return new Promise(success => {

            // 先寻找之前的缓存的图像
            let objectURL = this.previewURL.find(item => {
                return item.sec === time
            })

            // 获取新的图像
            let render = (): void => {

                this.ctx.drawImage(this.video, 0, 0, this.imageWidth, this.imageHeight)
                this.video.removeEventListener('seeked',render)

                let imgURL = window.URL.createObjectURL(
                    this.baseToBlob(
                        this.canvas.toDataURL('image/jpeg',.5)
                    )
                )

                // 添加进去 下次不用重新生成
                this.previewURL.push({
                    sec: time,
                    url: imgURL
                })

                success(imgURL)

            }

            // 如果之前没有缓存过就重新获取图像
            if(objectURL === undefined) {
                this.video.addEventListener('seeked',render)
                this.video.currentTime = time
            } else {
                success(objectURL.url)
            }
            
        })
    }

    // base64 转成 Blob
    baseToBlob(base64: string): Blob {
        let [fileTop, bstr]: string[] = base64.split(',')
        bstr = atob(bstr)
        let n      : number     = bstr.length 
        let uintArr: Uint8Array = new Uint8Array(n)
        while(n--){
            uintArr[n] = bstr.charCodeAt(n)
        }
        return new Blob([uintArr], {
            type:fileTop.match(/:(.*?);/)[1]
        })
    }

}

export default Farme

