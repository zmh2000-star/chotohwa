var en_cours = 0;
var n = 0;
var slide= 0;

var wSize = {
	wh : $(window).outerHeight(),
	ww : $(window).outerWidth()
}

$(document).ready(function() {		
	wSize.wh = $(window).outerHeight();	
	wSize.ww = $(window).outerWidth();
	$("#one, #two, #three, #four, #five, #six").height(wSize.wh);
	
	if(wSize.ww<1200){	
		wSize.ww = 1200;
		$("#one, #two, #three, #four, #five, #six").width(wSize.ww);	
		
		wSize.wh = $(window).outerHeight();	
		$("#one, #two, #three, #four, #five, #six").height(wSize.wh);
	}
	
	
		$("#six_01 a").css({"margin-left":(wSize.ww/2)-160});
		$("#six_01 span").css({"margin-left":(wSize.ww/2)-170});
		$("#six_02 a").css({"margin-left":(wSize.ww/2)-160});
	
	$(".con_text_list").width(wSize.ww); 
	
	
	$("body").mousewheel(function(event, delta) {		
		if (delta > 0) {
			if(!$('html, body').is(":animated")){
				precedent();
			}			
		} else {
			if(delta < 0) {
				if(!$('html, body').is(":animated")){
					suivant();
				}				
			}
		}
		return false;
	});
	
	$(".btn_left").bind("click",function(){
		prevslide()
		return false;
	});
	$(".btn_right").bind("click",function(){
		nextslide()
		return false;
	});
	
	// custom scroll 
	$(".faq").mCustomScrollbar({
		scrollInertia:50,
		autoDraggerLength:true,
		advanced:{
        	updateOnBrowserResize: true,
    		updateOnContentResize: true
    	}
	});
	$(".six_03_con").mCustomScrollbar({
		scrollInertia:50,
		autoDraggerLength:true,
		advanced:{
        	updateOnBrowserResize: true,
    		updateOnContentResize: true
    	}
	});
	$("#six_03").hide();
	
	
	$(".six_04_con").mCustomScrollbar({
		scrollInertia:50,
		autoDraggerLength:true,
		advanced:{
        	updateOnBrowserResize: true,
    		updateOnContentResize: true
    	}
	});
	$("#six_04").hide();
	
	// movie
	$(".play").bind("click",function(){
		$(".movie_area").show();
	});
	
	//input
	$("input, textarea").bind("focusin",function(){
		$(this).addClass("focus");
		$(".btn_select").removeClass("on");
		$("#select_box").hide();
	});
	
	
	$("input, textarea").bind("focusout",function(){
		$(this).removeClass("focus");
		var a = $(this).val()
		if(a!=""){
			$(this).addClass("on");
		}
		if(a==""){
			$(this).removeClass("on");
		}
	});
	
	//select box
	$(".btn_select").bind("click", function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on");
			$("#select_box").hide();
		}else{
			$(this).addClass("on");
			$("#select_box").show();
		}
		return false;
	});
	
	$("#select_box ul li a").bind("click", function(){
		var a = $(this).text();
		$(".btn_select").text(a);
		$(".btn_select").removeClass("on");
		$("#select_box").hide();

		$('#kind').val( $(this).attr('value') );
	});	
	
	//faq
	$(".faq .tit").bind("click", function(){	
		$(this).toggleClass("on");
		$(this).next(".faq_con").slideToggle();	
		return false;
	});
});


$(window).resize(function() {	
	wSize.wh = $(window).outerHeight();
	wSize.ww = $(window).outerWidth();
	
	if(wSize.ww<1200){	
		wSize.ww = 1200;
	}	
	
	$("#one, #two, #three, #four, #five, #six").width(wSize.ww);
	$("#one, #two, #three, #four, #five, #six").height(wSize.wh);	
	$(".con_text_list").width(wSize.ww);	
	
	
	$("#six_01 a").css({"margin-left":(wSize.ww/2)-152});
	$("#six_01 span").css({"margin-left":(wSize.ww/2)-160});
	$("#six_02 a").css({"margin-left":(wSize.ww/2)-152});
			
});

$(window).scroll(function() {
	wSize.wh = $(window).outerHeight();
	var swh = $(window).outerHeight()/2;
	scrollTop = $(window).scrollTop();
	
	speed = 0.4;
		
	$('#three').css('backgroundPosition', '50%' + " " + Math.round((wSize.wh*2 - scrollTop) * speed) + "px");
	$('#four').css('backgroundPosition', '50%' + " " + Math.round((wSize.wh*3 - scrollTop) * speed) + "px");	
	$('#five').css('backgroundPosition', '50%' + " " + Math.round((wSize.wh*4 - scrollTop) * speed) + "px");
	$('#six').css('backgroundPosition', '50%' + " " + Math.round((wSize.wh*5 - scrollTop) * speed) + "px");
	
	
	
	if(scrollTop>=0 && scrollTop<$('#two').offset().top) maj_nav(0);
	else if(scrollTop>=$('#two').offset().top && scrollTop<$('#three').offset().top) maj_nav(1);
	else if(scrollTop>=$('#three').offset().top && scrollTop<$('#four').offset().top) maj_nav(2);
	else if(scrollTop>=$('#four').offset().top && scrollTop<$('#five').offset().top) maj_nav(3);
	else if(scrollTop>=$('#five').offset().top && scrollTop<$('#six').offset().top) maj_nav(4);
	else if(scrollTop>=$('#six').offset().top) maj_nav(5);		
	

	if(scrollTop>=$('#one').offset().top-swh && scrollTop<$('#two').offset().top){
		$('.app_store').stop().animate({"bottom":15}, 500, 'easeOutExpo');
		$("#two .con_01").stop().animate({"top":"150%"}, 200);		
	}else{			
		$('.app_store').stop().animate({"bottom":wSize.wh-77}, 500, 'easeOutExpo');
	}	
	
	if(scrollTop>=$('#two').offset().top-swh && scrollTop<$('#three').offset().top+swh){
		$("#two .con_01").stop().animate({"top":"50%"}, 200);	
				
		$(".deco_01").stop().animate({"top":70+wSize.wh}, 200);		
		$(".deco_02").stop().animate({"top":10+wSize.wh}, 200);		
		$(".deco_03").stop().animate({"bottom":230-wSize.wh}, 200);		
		$(".deco_04").stop().animate({"bottom":64-wSize.wh}, 200);		
		$(".deco_05").stop().animate({"bottom":34-wSize.wh}, 200);			
		$(".deco_06").stop().animate({"top":122+wSize.wh}, 200);		
		$(".deco_07").stop().animate({"top":250+wSize.wh}, 200);		
		$(".deco_08").stop().animate({"bottom":265-wSize.wh}, 200);		
		$(".deco_09").stop().animate({"bottom":50-wSize.wh}, 200);		
		$(".deco_10").stop().animate({"bottom":125-wSize.wh}, 200);		
	}	
	
	
	if(scrollTop>=$('#three').offset().top-swh && scrollTop<$('#four').offset().top+swh){		
		$("#two .con_01").stop().animate({"top":"-150%"}, 200);	
				
		$(".deco_01").stop().animate({"top":70}, 250);		
		$(".deco_02").stop().animate({"top":10}, 100);		
		$(".deco_03").stop().animate({"bottom":230}, 200);		
		$(".deco_04").stop().animate({"bottom":64}, 300);		
		$(".deco_05").stop().animate({"bottom":34}, 500);
		$(".deco_06").stop().animate({"top":122}, 200);
		$(".deco_07").stop().animate({"top":250}, 500);		
		$(".deco_08").stop().animate({"bottom":265}, 250);		
		$(".deco_09").stop().animate({"bottom":50}, 200);		
		$(".deco_10").stop().animate({"bottom":125}, 500);		
		
			
	}
	
	
	if(scrollTop>=$('#four').offset().top-swh && scrollTop<$('#five').offset().top+swh){	
		$(".deco_01").stop().animate({"top":70-wSize.wh}, 200);		
		$(".deco_02").stop().animate({"top":10-wSize.wh}, 200);		
		$(".deco_03").stop().animate({"bottom":230+wSize.wh}, 200);		
		$(".deco_04").stop().animate({"bottom":64+wSize.wh}, 200);		
		$(".deco_05").stop().animate({"bottom":34+wSize.wh}, 200);			
		$(".deco_06").stop().animate({"top":122-wSize.wh}, 200);		
		$(".deco_07").stop().animate({"top":250-wSize.wh}, 200);		
		$(".deco_08").stop().animate({"bottom":265+wSize.wh}, 200);		
		$(".deco_09").stop().animate({"bottom":50+wSize.wh}, 200);		
		$(".deco_10").stop().animate({"bottom":125+wSize.wh}, 200);	
		
	
		$(".five_con_01").stop().animate({"top":-155+wSize.wh}, 200);	
		$(".five_con_02").stop().animate({"bottom":-120-wSize.wh}, 200);	
		$(".five_con_03").stop().animate({"bottom":26-wSize.wh}, 200);	
		$(".five_con_04").stop().animate({"top":80+wSize.wh}, 200);	
		$(".five_con_05").stop().animate({"bottom":-225-wSize.wh}, 200);	
		$(".five_con_06").stop().animate({"bottom":-160-wSize.wh}, 200);	
	}
	
	if(scrollTop>=$('#five').offset().top-swh && scrollTop<$('#six').offset().top+swh){	
		
		$(".five_con_01").stop().animate({"top":-155}, 200);	
		$(".five_con_02").stop().animate({"bottom":-120}, 300);	
		$(".five_con_03").stop().animate({"bottom":26}, 500);	
		$(".five_con_04").stop().animate({"top":80}, 150);	
		$(".five_con_05").stop().animate({"bottom":-225}, 250);	
		$(".five_con_06").stop().animate({"bottom":-160}, 400);	
	}
	
	if(scrollTop>=$('#six').offset().top-swh){		
	
		$(".five_con_01").stop().animate({"top":-155-wSize.wh}, 200);	
		$(".five_con_02").stop().animate({"bottom":-120+wSize.wh}, 200);	
		$(".five_con_03").stop().animate({"bottom":26+wSize.wh}, 200);	
		$(".five_con_04").stop().animate({"top":80-wSize.wh}, 200);	
		$(".five_con_05").stop().animate({"bottom":-225+wSize.wh}, 200);	
		$(".five_con_06").stop().animate({"bottom":-160+wSize.wh}, 200);	

	}
	
});	


function stop_movie(){
	m_movie.stopVideo();
	$(".movie_area").hide();
}

function voir(calque) {	
	if(calque=='h') destY = 0;
	else {
		var target_offset = $("#"+calque).offset();
		var destY = target_offset.top + 0;
	}	
	$('html, body').animate({scrollTop:destY}, 1000, 'easeInOutExpo');
}

function maj_nav(n) {
	en_cours = n;
	for(i=0; i<6; i++) if(i==n) {
		$('#nav span:eq('+i+')').addClass('active');
	} else {
		$('#nav div span:eq('+i+')').removeClass('active');
	}
	$(".mon_menu li").removeClass('on');	
	
	switch(en_cours){
	case 0:
		$(".menu_01").addClass("on");
	  break;
	case 1:
		$(".menu_01").addClass("on");	
	  break;
	case 2:
		$(".menu_02").addClass("on");	
	  break;
	case 3:
		$(".menu_02").addClass("on");	
	  break;
	case 4:
		$(".menu_03").addClass("on");	
	  break;
	case 5:
		$(".menu_04").addClass("on");	
	  break;
	}
}

function precedent() {
	en_cours--;
	if(en_cours<0) 	en_cours = 0;
	if(en_cours==0)	voir('one');
	if(en_cours==1)	voir('two');
	if(en_cours==2)	voir('three');
	if(en_cours==3)	voir('four');
	if(en_cours==4)	voir('five');
	if(en_cours==5)	voir('six');
}

function suivant() {
	en_cours++;
	if(en_cours>5) en_cours = 5;
	if(en_cours==0)	voir('one');
	if(en_cours==1)	voir('two');
	if(en_cours==2) voir('three');
	if(en_cours==3) voir('four');
	if(en_cours==4) voir('five');
	if(en_cours==5) voir('six');
}

function prevslide() {
	if(!$(".con_list").is(":animated")){		
		if(slide<=1) {
			$(".btn_left_off").show();
			$(".btn_left").hide();
		}		
		if(slide<=3){
			$(".btn_right_off").hide();
			$(".btn_right").show();
		}
		if(slide>0){	
			$(".con_list").animate({left: "+=254"},500, 'easeInOutExpo');
			$(".con_text_list span").animate({left: "+=100%"},1000, 'easeInOutExpo');
			slide--;
		}	
	}
}

function nextslide() {
	if(!$(".con_list").is(":animated")){			
		if(slide>=2) {
			$(".btn_right_off").show();
			$(".btn_right").hide();
		}			
		if(slide>=0) {
			$(".btn_left_off").hide();
			$(".btn_left").show();
		}	
		if(slide<3){
			$(".con_list").animate({left: "-=254"},500, 'easeInOutExpo');
			$(".con_text_list span").animate({left: "-=100%"},1000, 'easeInOutExpo');
			slide++;
		}	
	}	
}
function six(n){
	var a = n;
	if(a==1){
		$("#six_01, #six_01 a").fadeOut(500);	
		$("#six_02, #six_02 a").fadeOut(500);	
		$("#six_04, #six_04 a").fadeOut(500);	
		$("#six_03, #six_03 a").fadeIn(500);
	}
	
	if(a==2){
		$("#six_01, #six_01 a").fadeIn(500);	
		$("#six_02, #six_02 a").fadeIn(500);	
		$("#six_03, #six_03 a").fadeOut(500);	
		$("#six_04, #six_04 a").fadeOut(500);	
	}
	
	
	if(a==5){
		$("#six_01, #six_01 a").fadeOut(500);	
		$("#six_02, #six_02 a").fadeOut(500);	
		$("#six_03, #six_03 a").fadeOut(500);	
		$("#six_04, #six_04 a").fadeIn(500);
	}
	
	if(a==3){
		$("#six_01").animate({left: "-=100%"},1000, 'easeInOutExpo');
		$("#six_02").animate({left: "-=100%"},1000, 'easeInOutExpo');
	}
	if(a==4){
		$("#six_01").animate({left: "+=100%"},1000, 'easeInOutExpo');
		$("#six_02").animate({left: "+=100%"},1000, 'easeInOutExpo');		
	}
}


function fixPosition(){
	scrollTop = $(window).scrollTop();	
	var a = wSize.wh/2
	var a = scrollTop+a
	
	if(a>=0 && a<$('#two').offset().top){
		maj_nav(1);
		voir('one');
	}
	else if(a>=$('#two').offset().top && a<$('#three').offset().top){
		maj_nav(2);	
		voir('two');
	}
	else if(a>=$('#three').offset().top && a<$('#four').offset().top){
		maj_nav(3);	
		voir('three');
	}
	else if(a>=$('#four').offset().top && a<$('#five').offset().top){
		maj_nav(4);	
		voir('four');
	}
	else if(a>=$('#five').offset().top && a<$('#six').offset().top){
		maj_nav(5);	
		voir('five');
	}
	else if(a>=$('#six').offset().top){
		 maj_nav(5);
		 voir('six');
	}	
}

// fix position
var rtime = new Date(1, 1, 2000, 12,00,00);
var timeout = false;
var delta = 200;

$(window).resize(function() {
	rtime = new Date();
	if (timeout === false) {
		timeout = true;
		setTimeout(resizeend, delta);
	}
});

function resizeend() {
	if (new Date() - rtime < delta) {
		setTimeout(resizeend, delta);
	} else {
		timeout = false;
		fixPosition(); // Reset Viewport								
	}               
}