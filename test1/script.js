window.onscroll=function() {
    var div1=document.getElementById('div1');

    var top=document.documentElement.scrollTop;
    var bottom=screen.height+top;

    var div1_h=100;
    var x1=1750;
    var x2=3350;

    if (bottom>x1)
        if (top>=x2-div1_h)
            div1.style.top=(x2-div1_h).toString()+'px';
        else div1.style.top=top.toString()+'px';
    else div1.style.top='0';
}