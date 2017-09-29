var WINDOW_WIDTH  = 1024;
var WINDOW_HEIGHT = 600;
var RADIUS        = 8;      //每个小圆的半径长
var MARGIN_TOP    = 50;     //每个数字的上边距
var MARGIN_LEFT   = 20;     //每个数字的左边距

const endTime = new Date(2017,8,31,00,00,00);       //倒计时结束的时间
var curTime = 0;                                    //当前时间距倒计时的剩余时间

var balls = [];   //存放掉落的小球
var colors = ['#33b5e5','#0099cc','#aa66cc','9933cc','#99cc00','#669900','#ffbb33','ff8800','ff4444','#cc0000']; //存放掉落的小球的颜色

window.onload = function(){
    var canvas  = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width  = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curTime = getCurrentTime();       //获取当前所剩秒数
    setInterval(
        function() {
            render(context);          //自定义render函数进行绘制操作
            update();                 //修改数据
        }
        ,20                           //设置动画的刷新时间(单位ms),如果设置20ms刷新一次，一秒1000ms,则动画的帧数为50帧
    );
}

/*update():修改数据
* */
function update(){
    //nextTime获取当前的时间,与setInterval中的时间对比
    //由于动画效果刷新时间很快，本例中，一秒会执行此函数5次，所以每次获取当前时间可能相等也可能不等
    //不等则意味已经时间过了一秒
    var nextTime   = getCurrentTime();
    var nextHour   = parseInt( nextTime/3600 );
    var nextMinute = parseInt( (nextTime-3600*nextHour) /60);
    var nextSecond = nextTime % 60;

    var curHour    = parseInt( curTime/3600 );
    var curMinute  = parseInt( (curTime-3600*nextHour) /60);
    var curSecond  = curTime % 60;

    //只需要判断秒数是否相等即可判断，分别判断每次变化时，变化的是时分秒的个位数还是十位数
    if(nextSecond != curSecond){

        if(parseInt(nextHour/10) != parseInt(curHour/10)){
            addBalls(MARGIN_LEFT,MARGIN_TOP,parseInt(curHour/10));
        }
        if(parseInt(nextHour%10) != parseInt(curHour%10)){
            addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHour%10));
        }

        if(parseInt(nextMinute/10) != parseInt(curMinute/10)){
            addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinute/10));
        }
        if(parseInt(nextMinute%10) != parseInt(curMinute%10)){
            addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinute%10));
        }

        if(parseInt(nextSecond/10) != parseInt(curSecond/10)){
            addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSecond/10));
        }
        if(parseInt(nextSecond%10) != parseInt(curSecond%10)){
            addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSecond%10));
        }

        //将新的实践赋值给curTime
        curTime = nextTime;
    }
    updateBalls();
}

/*updateBalls():修改每个小球的位置，完成小球掉落的特效
* */
function updateBalls(){
    var len = balls.length;             //获取掉落的小球的总个数
    for(var i=0;i < len;i++){
        balls[i].x += balls[i].vx;      //x方向位移f(x) = x + V(x)
        balls[i].y += balls[i].vy;      //y方向位移f(y) = y + V(y)
        balls[i].vy += balls[i].g;      //y方向速度V(y) = V(y) + g  g为重力加速度

        //底部碰撞检测，如果小球掉过底部边框，y方向速度转向，并乘以一个空气摩擦系数，模拟速度的损耗
        if(balls[i].y >= WINDOW_HEIGHT-RADIUS){
            balls[i].y = WINDOW_HEIGHT-RADIUS;      //将小球位置改为‘放‘在底边框上
            balls[i].vy = -balls[i].vy*0.7;
        }
    }
}

/*addBalls(): 将当前变化的一位数字所包含的小球（之后要掉落的小球）存放在Array balls中
* @param int x    变化数字的x坐标起点
* @param int y    变化数字的y坐标起点
* @param int num  变化数字的值
* */
function addBalls(x,y,num){
    for(var i=0;i < digit[num].length ;i++)
        for(var j=0;j < digit[num][i].length ;j++) {
            if (digit[num][i][j] == 1) {
                    //新建一个aball对象存放组成数字的各个小球的信息
                    var aball = {
                        x : Number(MARGIN_LEFT+x+(2*j+1)*(RADIUS+1)),               //小球的x起始坐标
                        y : Number(MARGIN_TOP+y+(2*i+1)*(RADIUS+1)),                //小球的y起始坐标
                        vx : Number(4*Math.pow(-1,parseInt(1000*Math.random()))),   //小球的起始x速度
                        vy : -10,                                                   //小球的起始y速度
                        g : Number(2+3*Math.random().toFixed(1)),                   //小球的掉落加速度
                        color : colors[Math.floor((colors.length)*Math.random())]   //小球的颜色
                    }
                    balls.push(aball);      //将小球push到数组balls中
            }
        }
}

function getCurrentTime(){
    var curDate = new Date();                               //获取当前的时间
    var ret = endTime.getTime() - curDate.getTime();        //getTime获取距1970的毫秒，ret获取距倒计时的时间的毫秒数
    ret = Math.round(ret)/1000;                             //将毫秒数转化为秒数，再化为整数

    return ret>0 ? ret : 0;                                 //如果倒计时结束，返回0，否则返回剩余的秒数
}

/*render()函数：绘制数字
* @context ext cansas的上下文环境
* */
function render(ext){

    ext.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    var hour   = parseInt( curTime / 3600 );
    var minute = parseInt( (curTime - hour*3600)/60 );
    var second = curTime % 60;

    //自定义renderDigit绘制单个数字
    renderDigit(MARGIN_LEFT                ,MARGIN_TOP,parseInt(hour/10)  ,ext);  //小时
    renderDigit(MARGIN_LEFT + 15*(RADIUS+1),MARGIN_TOP,parseInt(hour%10)  ,ext);
    renderDigit(MARGIN_LEFT + 30*(RADIUS+1),MARGIN_TOP,10                 ,ext);  //冒号
    renderDigit(MARGIN_LEFT + 39*(RADIUS+1),MARGIN_TOP,parseInt(minute/10),ext);  //分钟
    renderDigit(MARGIN_LEFT + 54*(RADIUS+1),MARGIN_TOP,parseInt(minute%10),ext);
    renderDigit(MARGIN_LEFT + 69*(RADIUS+1),MARGIN_TOP,10                 ,ext);  //冒号
    renderDigit(MARGIN_LEFT + 78*(RADIUS+1),MARGIN_TOP,parseInt(second/10),ext);  //秒钟
    renderDigit(MARGIN_LEFT + 93*(RADIUS+1),MARGIN_TOP,parseInt(second%10),ext);

    //绘制掉落的小球
    var len = balls.length;
    for(var i=0;i < len;i++){
        ext.fillStyle = balls[i].color;
        ext.beginPath();
        ext.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
        ext.closePath();
        ext.fill();
    }
}

/*renderDigit():绘制单个数字
* @int x        绘制起点的x坐标
* @int y        绘制起点的y坐标
* @int num      要绘制的数字
* @context ext  canvas的上下文环境
* */
function renderDigit(x,y,num,ext){
    ext.fillStyle = 'rgb(0,102,153)';

    for(var i=0;i < digit[num].length ;i++)
        for(var j=0;j < digit[num][i].length ;j++){
            if(digit[num][i][j] == 1){
                ext.beginPath();

                //要绘制的圆的圆心计算为
                // x = x + j*2*(R+1) + (R+1)
                // y = y + i*2*(R+1) + (R+1)
                ext.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
                ext.closePath();
                ext.fill();
            }
        }
}