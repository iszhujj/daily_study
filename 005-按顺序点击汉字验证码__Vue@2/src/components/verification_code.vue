<template>
    <div class="out">
        <!-- 背景风景图 -->
        <img class="show_picture" :src="show_picture.src" alt="风景图">
        <div @click="click_hanzi(e.id)" class="text" :style="e.style" 
            v-for="(e,index) of hanzi" :key="index + 'a'" >
            {{e.value}}
        </div>
        
        <div v-show="show_update_button() == true">
            <p>请依次点击汉字"{{hanzi[0].value}}","{{hanzi[1].value}}","{{hanzi[2].value}}","{{hanzi[3].value}}"以完成验证</p>
            <button class="but" @click="start()" v-show="show_update_button() == true">换一张</button>
        </div>
        <div class="pass_img" v-show="show_end_tip==true">
            <p>{{end_picture_text}}</p>
        </div>

        <img v-for="(ele,i) of [0,1,2,3]" :key="ele * i" @click="clean_select(ele)" 
            v-show="has_click_number > ele && show_update_button() == true" 
            class="tip_img" :style="tip_num_style[ele + 1]" :src="`数字${ele + 1}.png`" :alt="ele">
    </div>
</template>

<script>
export default {
    data(){
        return{
            digits:['1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f'],
            // 背景图片
            pictures:[
                {id:0,src:'https://img2.baidu.com/it/u=1381481047,1529970259&fm=253&fmt=auto&app=138&f=JPEG?w=752&h=500'},
                {id:1,src:'https://img2.baidu.com/it/u=4286724097,1475456570&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500'},
                {id:2,src:'https://img1.baidu.com/it/u=2310170655,486191485&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281'},
                {id:3,src:'https://img2.baidu.com/it/u=2526401426,2132302010&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281'},
                {id:4,src:'https://img2.baidu.com/it/u=2279721922,3725358742&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'},
                {id:5,src:'https://img1.baidu.com/it/u=2605372625,2257936617&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313'},
                {id:6,src:'https://img2.baidu.com/it/u=188805366,3528195373&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=675'},
                {id:7,src:'https://img0.baidu.com/it/u=381886100,3541087750&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281'},
                {id:8,src:'https://img2.baidu.com/it/u=769068768,1914010451&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'}
            ],
            show_picture:{},
            hanzi:(new Array(4)).fill({}),
            tip_num_style:[],
            has_click_hanzi:[],
            has_click_number:0,         //选择（点击）了多少个数字
            end_picture_text:"",
            has_past:false,
            show_end_tip:false,
            able_to_try:true,
            has_try:0
        }
    },
    methods:{
        start(){
            this.show_end_tip=false
            this.has_click_number=0
            for(let i=0;i<4;i++){
                this.has_click_hanzi[i]={id:i,click_No:0,has_click:false}       // click_No是第几个点击
            }
            this.tip_num_style=new Array({    
                float: "left",
                left: "",
                top: ""
            })
            // 随机生成一张背景图片
            this.show_picture=this.pictures[Math.floor(Math.random()*9)]
            // 随机生成四个不同的 utf-8 编码的文字
            let arr=new Array()
            for(let i=0;i<4;i++){
                let b=false
                let msg
                while(!b){
                    msg="%u"
                    for(let j=0;j<4;j++){
                        if(j==0){
                            let temp=Math.floor(4+Math.random()*5)
                            msg+=temp
                        }else{
                            let t=Math.floor(Math.random()*15)
                            msg+=this.digits[t]
                        }
                    }
                    if(arr.indexOf(msg)!=-1){
                        b=false
                    }else{
                        b=true
                    }
                }
                arr.unshift(msg)
            }
            // 四个汉字随机解码 放入 hanzi 数组中
            let num = (new Array(4)).fill(0)          //对应arr的四个数，已经加入的置1
            for(let i = 0; i < 4; i++){
                let x = Math.floor(Math.random()*4)
                if(i == 0){
                    num[x]=1
                    let k = this.turn_and_position(i)
                    this.hanzi.unshift({id:x,value:unescape(arr[x]),style:k})
                    this.hanzi.pop()
                }else{
                    while(num[x] == 1){
                        x=Math.floor(Math.random() * 4)
                    }
                    num[x] = 1
                    let k = this.turn_and_position(i)
                    this.hanzi.unshift({id:x,value:unescape(arr[x]), style:k})
                    this.hanzi.pop()
                }
            }
            this.hanzi.sort((a,b)=>{
                return a.id-b.id
            })
        },
        turn_and_position(t){
            // 四个汗字，将图片分成四个区域，将四个数随机放在不同的区域
            let val_0,val_1
            if(t==0){val_0 = 50,val_1 = 50}
            else if(t==1){val_0 = 180,val_1 = 50}
            else if(t==2){val_0 = 50,val_1 = 120}
            else if(t==3){val_0 = 180,val_1 = 120}

            let left=Math.floor(val_0+Math.random()*val_0)+"px"
            let top=Math.floor(val_1+Math.random()*val_1)+"px"
            let msg=""
            let rotate=Math.floor(-50+Math.random()*50)
            let scale_x=0.9+Math.random()*1.5
            let scale_y=0.9+Math.random()*1.5
            let skew_x=Math.random()*20
            let skew_y=Math.random()*20
            msg="rotate("+rotate+"deg) "+"scale("+scale_x+","+scale_y+") "+"skew("+skew_x+"deg,"+skew_y+"deg)"
            return {left:left,top:top,transform:msg}
        },
        click_hanzi(val){
            this.has_click_hanzi[val].has_click=!this.has_click_hanzi[val].has_click
            if(this.has_click_hanzi[val].has_click==true){        //选择点击 则依次增加
                let max=Math.max(this.has_click_hanzi[0].click_No,this.has_click_hanzi[1].click_No,this.has_click_hanzi[2].click_No,this.has_click_hanzi[3].click_No);
                this.has_click_hanzi[val].click_No=max+1
                let left=this.hanzi[val].style.left
                let top=this.hanzi[val].style.top
                this.tip_num_style.push({left:left,top:top})
                this.has_click_number+=1

                if(this.has_click_number==4){           //用户点击了四个数之后就检查并提示
                    this.end_check()
                }
            }else{                                      //取消点击则取消比其次序大的选项
                let temp=this.has_click_hanzi[val].click_No
                for(let e of this.has_click_hanzi){
                    if(e.click_No>=temp){
                        e.click_No=0
                        e.has_click=false
                        this.has_click_number-=1
                        this,this.tip_num_style.splice(e.click_No-1,1)
                    }
                }
            }
        },
        end_check(){                        //用户点击了四个数之后就检查并提示
            if(this.has_click_hanzi[0].has_click==this.has_click_hanzi[1].has_click==this.has_click_hanzi[2].has_click==this.has_click_hanzi[3].has_click==true){
                let b=true
                for(let e of this.has_click_hanzi){
                    if(e.click_No!=e.id+1){
                        b=false
                        break
                    }
                }
                if(b==true){
                    this.has_past=true
                    this.show_end_tip=true
                    this.end_picture_text="已通过验证！"
                }else{
                    this.has_past=false
                    this.show_end_tip=true
                    this.has_try+=1
                    if(this.has_try<3){
                            this.end_picture_text="请重试！\n剩余机会"+(3-parseInt(this.has_try))+"次！"
                        setTimeout(() => {
                            this.start()
                        }, 2000);                        
                    }else{
                        this.end_picture_text="验证失败！"
                        this.able_to_try=false
                    }

                }
            }
        },
        show_update_button(){
            if(this.has_past==false && this.able_to_try==true){
                return true
            }else{
                return false
            }
        },
        clean_select(val){                  //点击数字提示图片时也能达到清除效果
            for(let e of this.has_click_hanzi){
                if(e.click_No>val){
                    e.click_No=0
                    e.has_click=false
                    this.has_click_number=val
                    this.tip_num_style.splice(val+1,1)
                }
            }
        }
    },
    mounted(){
        this.has_past=false
        this.has_try=0
        this.start()
    }
}
</script>


<style scoped>
.out{
    width: 400px;
    height: atuo;
    position: relative;
}
.show_picture{
    width:400px;
    height:300px;
    z-index: 1;
}
.text{
    font-size: 20px;
    width: 25px;
    height:25px;
    border-radius: 5px;
    background-color:white;
    position: absolute;
    z-index:5;
    background:-webkit-gradient(linear, 0 0, 0 bottom, from(rgba(241, 210, 240, 0.644)), to(rgba(0, 0, 255, 0)));
}
.text:hover{
    cursor: pointer;
}
.tip_img{
    width: 15px;
    height: 15px;
    position: absolute;
    background-color: white;
    border-radius: 5px;
    z-index: 10;
}
.tip_img{
    cursor: pointer;
}
.pass_img{
    background: gainsboro;
    opacity:0.9;
    width: 400px;
    height: 300px;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: 600;
    position: absolute;
    float: left;
    top: 0px;
    left: 0px;
    z-index: 15;
}
.but{
    border: 2px solid rgba(7, 183, 241, 0.934);
    border-radius: 8px;
    width: 80px;
    height: 40px;
    font-size: 18px;
    font-weight: 400;
    background-color: rgba(122, 208, 237, 0.734);
    opacity: 0.7;
}
.but:hover{
    box-shadow: 3px 4px gainsboro;
    font-weight: 700;
    border-radius: 10px;
    border-width: 3px;
    cursor: pointer;
}
</style>