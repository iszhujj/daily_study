import React, {useEffect, useState, memo, useRef} from 'react'
import './SlidePictures.scss'

/**
 * props 的参数
 * picturesArr: Array   （must）
 *      对象数组{src:String, alt:String, index:Number 从零开始}
 * circleOrSquare: Number   (0:'square', 1:'circle')
 *      下方的控制点事圆圈还是矩形
 * useControlPoint: Boolean
 *      是否启用下方的控制点
 * useLeftAndRight: Boolean
 *      是否启用左右两侧的控制标签
 * width:Number
 *      每一张图片的宽度(宽高必须同时设置)
 * height:Number
 *      每一张图片的高度(宽高必须同时设置)
 */
const SlidePictures = memo((props) => {
    const CONTROL_INDEX = 260;          // 控制图片的切换速度
    // 复制第一张图片在最后
    const picturesArr = [...props.picturesArr, props.picturesArr[0]];
    const circleOrSquare = props.circleOrSquare || 0;
    const useControlPoint = (props.useControlPoint || true) && (picturesArr.length > 2);
    const useLeftAndRight = (props.useLeftAndRight || true) && (picturesArr.length > 2);
    const WIDTH = props.width || 600;
    const HEIGHT = props.height || 400;

    const [mouseEnter, setMouseEnter] = useState(false);       //鼠标是否悬浮在整个区域上
    const [pictureShowing, setPictureShowing] = useState(0);   //当前展示的是第几张图片

    const picturesUl = useRef();                    // 图片外部的ul
    const circlesContainer = useRef();              // 底部的小圆圈
    const customChanging = useRef(false);           // 是否人为地引起了改变
    const defaultChanging = useRef(false);          // 默认切换图片

    const observer = new IntersectionObserver((entries, observer) => {  
        entries.forEach(entry => {  
            if(entry.isIntersecting) {  
                const lazyImage = entry.target;  
                lazyImage.src = lazyImage.dataset.src;
                observer.unobserve(lazyImage);  
            }  
        });  
    });

    // 控制图片切换的方法
    // (当前所展示的图片索引currentPictureIndex，用于控制是否变换的值controlIndex)
    // 当currentIndex累加到与controlIndex相等时，会进行图片的切换
    const changeAction = (currentPictureIndex, controlIndex, currentIndex) =>{
        if(customChanging.current || defaultChanging.current) return;
        if(currentIndex < controlIndex){
            requestAnimationFrame(() => {changeAction(currentPictureIndex, controlIndex, currentIndex + 1)})
        }else{
            defaultChanging.current = true;
            // 如果有 5 张有效的图片，那么length = 6
            const length = picturesArr.length;
            const targetIndex = (currentPictureIndex + 1) % length;
            if(currentPictureIndex === length - 1){
                picturesUl.current.classList.remove('ul-transition');
                setPictureShowing(0);
                requestAnimationFrame(() => {
                    // 会多走一次requestAnimationFrame，是为了确保 setPictureShowing 完成前没有给 picturesUl 添加 .ul-transition
                    changeAction(0, controlIndex, controlIndex - 1)
                })
            }else{
                if(!picturesUl.current.classList.contains('ul-transition')){
                    picturesUl.current.classList.add('ul-transition');
                }
                setPictureShowing(targetIndex);
                requestAnimationFrame(() => {changeAction(targetIndex, controlIndex, 1)})
            }
        }
    }

    // 上一张（被gotoDirectly调用）
    const lastPicutre = (customIndex) => {
        customChanging.current = true;
        const length = picturesArr.length;
        var targetIndex = customIndex % length;
        if(targetIndex < 0){
            picturesUl.current.classList.remove('ul-transition');
            let endIndex = length - 1;
            setPictureShowing(endIndex)
            requestAnimationFrame(() => {
                customChanging.current = false;
                changeAction(endIndex - 2, CONTROL_INDEX, CONTROL_INDEX - 1)
            })
        }else{
            setPictureShowing(targetIndex);
            requestAnimationFrame(()=>{
                customChanging.current = false;
                changeAction(targetIndex, CONTROL_INDEX, 1)
            })
        }
    }
    // 下一张（被gotoDirectly调用）
    const nextPictures = (customIndex) => {
        customChanging.current = true;
        const length = picturesArr.length;
        const targetIndex = customIndex % length;
        if(pictureShowing === length - 1 && customIndex === length){
            requestAnimationFrame(()=>{
                customChanging.current = false;
                changeAction(length - 1, CONTROL_INDEX, CONTROL_INDEX)
            })
        }else{
            setPictureShowing(targetIndex);
            requestAnimationFrame(()=>{
                customChanging.current = false;
                changeAction(targetIndex, CONTROL_INDEX, 1)
            })
        }
    }
    // 跳转到指定的图片位，index取值[0 ~ length-2]
    const gotoDirectly = (index) => {
        if(customChanging.current || defaultChanging.current) return;
        if(pictureShowing === picturesArr.length - 1 && index === 0) return;
        if(pictureShowing === picturesArr.length - 1 && index > 0){
            customChanging.current = true;
            picturesUl.current.classList.remove('ul-transition');
            setPictureShowing(0);
            requestAnimationFrame(()=>{
                customChanging.current = false;
                changeAction(index - 1, CONTROL_INDEX, CONTROL_INDEX - 2)
            })
        }else if(index < (pictureShowing) % (picturesArr.length - 1)){
            lastPicutre(index);
        }else if(index > (pictureShowing) % (picturesArr.length - 1)){
            nextPictures(index);
        }
    }

    useEffect(()=>{
        if(useControlPoint){
            // 如果有 5 张有效的图片，那么有效索引 realIndex 在 0~4, 但是 pictureShowing 可以取到 5
            const realIndex = pictureShowing >= (picturesArr.length - 1) ? 0 : pictureShowing;
            // 改变底部小圆圈的样式
            let pointsArr = Array.from(circlesContainer.current.childNodes);
            pointsArr.forEach(point => { 
                point.style.backgroundColor = "";
                point.style.opacity = 0.5;
                point.style.borderColor = '#999'
            })
            pointsArr[realIndex].style.backgroundColor = "#000";
            pointsArr[realIndex].style.opacity = 0.6;
            pointsArr[realIndex].style.borderColor = '#000'
        }
        if(defaultChanging.current) defaultChanging.current = false;
    },[pictureShowing])

    useEffect(()=>{
        // 配置图片懒加载
        const lazyImages = Array.from(picturesUl.current.childNodes).map(e => e.childNodes[0])
        if('IntersectionObserver' in window){  
            lazyImages.forEach(image => { observer.observe(image); });  
        }else{
            lazyImages.forEach(image => { image.src = image.dataset.src; });  
        }
        // 启动轮播图
        if(picturesArr.length > 2){
            requestAnimationFrame(() => {changeAction(0, CONTROL_INDEX, 1)})
        }
    },[])   // 注意，如果没有第二个参数（空数组），那么每次更新都会执行这个副作用。空数组保证只执行一次

if(useLeftAndRight){
    return (
        <div className="outest" style={(WIDTH && HEIGHT) ? {width:`${WIDTH}px`, height:`${HEIGHT}px`} : {}}
            onMouseOver={() => {setMouseEnter(true)}} onMouseLeave={() => {setMouseEnter(false)}} >
            {/* 向左icon，鼠标进入轮播图区域时才显现 */}
            {
                mouseEnter ? <img className="icon _left" src="left.png" 
                    alt="last" onClick={()=>{gotoDirectly(pictureShowing % (picturesArr.length - 1) - 1)}}/> : ''
            }

            {/* 主要图片 */}
            <ul ref={picturesUl} className='ul-transition' style={{
                transform: `translate(calc(${pictureShowing} * -${WIDTH}px), 0)`,
                width: `calc(${WIDTH}px * ${picturesArr.length})`
            }}>
            {
                picturesArr.map((e, i) => {
                    return (<li key={i} style={{width: `calc(100% / ${picturesArr.length})`}}>
                        <img data-src={e.src} alt={e.alt} loading='lazy'/>
                    </li>)
                })
            }
            </ul>

            {/* 底部小圆圈的设置 */}
            { useControlPoint ? (<div className='mydiv' ref={circlesContainer}>
                {
                    props.picturesArr.map((e, i) =>{
                        return (<div className={circleOrSquare ? 'circle def' : 'square def'}
                            key={e.index} onClick={()=>{gotoDirectly(i)}}>
                            </div>)
                    })
                }
            </div>) : (<></>)}

            {/* 向右icon，鼠标进入轮播图区域时才显现 */}
            {
                mouseEnter ? <img className="icon _right" src="right.png" alt="next" 
                    onClick={()=>{gotoDirectly(pictureShowing % (picturesArr.length - 1) + 1)}}/> : ''
            }
        </div>
    )
}else{
    return (
        <div className="outest" style={(WIDTH && HEIGHT) ? {width:`${WIDTH}px`, height:`${HEIGHT}px`} : {}}>
            {/* 主要图片 */}
            <ul ref={picturesUl} className='ul-transition' style={{
                transform: `translate(calc(${pictureShowing} * -600px), 0)`,
                width: `calc(${WIDTH}px * ${picturesArr.length})`
            }}>
            {
                picturesArr.map((e, i) => {
                    return (<li key={i} style={{width: `calc(100% / ${picturesArr.length})`}}>
                        <img data-src={e.src} alt={e.alt} loading='lazy'/>
                    </li>)
                })
            }
            </ul>

            {/* 底部小圆圈的设置 */}
            { useControlPoint ? (<div className='mydiv' ref={circlesContainer}>
                {
                    props.picturesArr.map((e, i) =>{
                        return (<div className={circleOrSquare ? 'circle def' : 'square def'}
                            key={e.index} onClick={()=>{gotoDirectly(i)}}>
                            </div>)
                    })
                }
            </div>) : (<></>)}
        </div>
    )
}
})

export default SlidePictures;