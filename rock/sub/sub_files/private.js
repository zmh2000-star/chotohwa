
		function doLoadPage(contentsIdVal){
			
			$("#contentsId").val(contentsIdVal);
			var reqUrl = "/viewContentsDetailPage";
			var param = $("#contentsForm").serialize();
			
			$("#contentsDataDiv").load(reqUrl, param, loadCompletion());
			
			// 상단네비게이션 데이터 가져오기
			$.ajax({
				url: "/viewContentsDetailAjax",
				type: "post",
				cache : false,
				dataType : "json",
				data: {
					"contentsId" : contentsIdVal
			    },
				success:function(data) {
					if(data != null){
						
						$("#pageNaviDiv").html("");
						if(null != data.preContentsSeq && "" != data.preContentsSeq){
							$("#pageNaviDiv").append("<a href='#null' onclick='doLoadPage("+ data.preContentsSeq +");' class='ico pre'><span class='blind'>이전</span></a>");	
						} else{
							$("#pageNaviDiv").append("<a class='ico pre'><span class='blind'>이전</span></a>");	
						}
						
						
						if(null != data.nextContentsSeq && "" != data.nextContentsSeq){
							$("#pageNaviDiv").append("<a href='#null' onclick='doLoadPage("+ data.nextContentsSeq +");' class='ico next'><span class='blind'>이후</span></a>");	
						} else{
							$("#pageNaviDiv").append("<a class='ico next'><span class='blind'>이후</span></a>");
						}
						
					
					} else{
						alert("오류가 발생하였습니다. 담당자에게 문의하시기 바랍니다.");	
					}
				},
				error :function(data) {
					alert("오류가 발생하였습니다. 담당자에게 문의하시기 바랍니다.");
				} 
			});	
			
		}

		function loadCompletion(){}
				
		
		
		var temporalScroll = 0;			
		var firstScrollTop = 'N';
		
		var barGubun = "w";
	
		$(function(){
			// 이전글 다음글에서 이동시 로딩시 좁은바 노출				
			if("n" == barGubun){
				$('html, body').animate({scrollTop : 107}, 500);  
				// 166px - 60px 사이즈 만틈 뺀거 이상으로 scrollTop 을 주면 contents 와 그린바 사이의 간격 조정 동일하게 처리 
				$(".scrl").css({"display" : "none"});
				$(".scrl_dn").css({"display" : "block", "opacity" : "0"}).animate({"opacity" : "1"}, 500); 
			}
			
			$("#header").css({"opacity" : "0"}).animate(
					{"opacity" : "1"}, 
					{duration : 1500, complete: function(){
						// IE일때 메인 상단박스 로고 애니메이션
						if("IE" == getBrowserType()){
							
							//$("#logo1").hide();
							//$("#logo1").delay(300).show("blind", 700);
						}
						
					}}, "easeInOutQuad" //점점 느리게  
			);				
			
			
			// IE일때 메인 상단박스 로고 애니메이션
			if("IE" == getBrowserType()){
				$("#logo1").attr("style", "opacity:0");
				$("#logo1").delay(300).animate({"padding-top": "+=5px", "opacity" : "1"}, 500, "easeOutCirc");
				
				//container
				$(".detail_con").css({"display" : "block", "opacity" : "0"}).delay(250).animate({"padding-top": "-=5px", "opacity" : "1"}, 500, "easeInCubic"); // easeInExpo, easeInQuint : 느리다가 점점 빠르게
			}				
			
			
			$(window).scroll(function(){
				var currentScrollTop = $(this).scrollTop();
				
				if (currentScrollTop > temporalScroll) { // down scroll
						
						if($(window).scrollTop() > 166){
							
							if("N" == firstScrollTop){	
								firstScrollTop = 'Y';
								
								if("w" == barGubun){
									$(".scrl_dn").slideDown(400, "swing", function(){
										$("#topBarNavi").show();
									});
									
								} else{
									if("block" != $(".scrl_dn").css("display")){
										$(".scrl_dn").css({"display" : "block", "opacity" : "0"}).animate({"opacity" : "1"}, 500);
									}
								}
							}
						} 
					
					
				} else{ // up scroll
					$(".scrl").show();
					
					if($(window).scrollTop() < 106){ // 166px - 60px
						firstScrollTop = 'N';
						$(".scrl_dn").fadeOut(100, "easeInQuad");
					}
				}
				
				temporalScroll = currentScrollTop;
			});

				
			//다른영역 마우스 클릭시 layer close
			$(document).mousedown(function(e){
				$("#shareLayer").each(function(){
			        if( $(this).css("display") == "block"){
			            var l_position = $(this).offset();
			            l_position.right = parseInt(l_position.left) + ($(this).width());
			            l_position.bottom = parseInt(l_position.top) + parseInt($(this).height());



			            if( ( l_position.left <= e.pageX && e.pageX <= l_position.right )
			                && ( l_position.top <= e.pageY && e.pageY <= l_position.bottom ) ) {
			                
			            } else {
			                //
			            	fnShareClose();				                
			            }
			        }					
				});
			});
			
		});
		

		function getBrowserType(){
			var _ua = navigator.userAgent;
		     
		    var trident = _ua.match(/Trident\/(\d.\d)/i);
		    if( trident != null ){
		    	// IE 11,10,9,8
		    	if( trident[1] == "7.0" || trident[1] == "6.0" || trident[1] == "5.0" || trident[1] == "4.0") return "IE";
		    	else return "others";
		    } else{
		    	return "others";
		    }	
			
		}			
		
		
		// 공유하기 open
		function fnShareOpen(){
			$("#shareDim").show();
			$("#shareLayer").show();
		}
		
		// 공유하기 close
		function fnShareClose(){
			$("#shareDim").hide();
			$("#shareLayer").hide();
		}
	
		// 공유하기
		function fnShareLink(gubun){
			var o;
			var _url = encodeURIComponent("http://design.naver.com/viewContentsDetail?contentsId=22");
			var _txt = encodeURIComponent("네이버 디자인 | 네이버 스퀘어 아이덴티티");  
			var _br  = encodeURIComponent('\r\n');
			
			
			var _contents = "<dl style='overflow:hidden; clear:both; width:580px; margin:0; padding:0;'>"
				+ "<dt style='float:left; width:91px; margin:0 19px 0 0; padding:0;'>"
				+ "<a href='http://design.naver.com/viewContentsDetail?contentsId=22' target='_blank' style='text-decoration: none;'>"
				+ "<img src='http://design.naver.com/upload/2015/20151116214446162391.png' width='100' height='100' >"
				+ "</a></dt>"
				+ "<dd style='width:481px; margin:0; padding-top:1px;'>"
				+ "<a href='http://design.naver.com/viewContentsDetail?contentsId=22' target='_blank' style='text-decoration: none;'>"
				+ "<strong style='font-size:14px;color:black;'>%B3%D7%C0%CC%B9%F6+%B5%F0%C0%DA%C0%CE+%7C+%B3%D7%C0%CC%B9%F6+%BD%BA%C4%F9%BE%EE+%BE%C6%C0%CC%B5%A7%C6%BC%C6%BC</strong></a>"				
				+ "<a href='http://design.naver.com/viewContentsDetail?contentsId=22' target='_blank' style='text-decoration: none;'>"
				+ "<p style='margin:0; padding:7px 0 0 0; font-size:12px; line-height:1.6;color:black;'>%B8%F0%B9%D9%C0%CF%BF%A1%BC%AD%C0%C7+%B4%D9%BE%E7%C7%D1+%BC%AD%BA%F1%BD%BA+%B0%A1%C4%A1%B8%A6+%B4%E3%BE%C6%B3%BD%0A%B3%D7%C0%CC%B9%F6%C0%C7+%BB%F5%B7%CE%BF%EE+%BA%EA%B7%A3%B5%E5+%BE%C6%C0%CC%B5%A7%C6%BC%C6%BC%2C+%B3%D7%C0%CC%B9%F6+%BD%BA%C4%F9%BE%EE%B8%A6+%BC%D2%B0%B3%C7%D5%B4%CF%B4%D9.</p>"
				+ "</a></dd></dl>";

				
			switch(gubun){
				case "tw":
		            o = {
		                method:"popup",
		                url:"http://twitter.com/intent/tweet?text=" + _txt + "&url=" + _url
		            };
					break;
				case "fb":
		            o = {
		                method:"popup",
		                url:"http://www.facebook.com/sharer/sharer.php?u=" + _url
		            };
					break;
				case "bd":
		            o = {
						// 밴드의 경우 body 에 전체 contents 넣어주기
		                method:"popup",
		                url:"http://www.band.us/plugin/share?body="+ _txt + _br + _url + "&route=" + _url
		            };
					break;
				case "blg":
		            o = {
		                method:"popup",
		                url:"http://blog.naver.com/ScrapForm.nhn?blogId=naver&source_type=120&title=%B3%D7%C0%CC%B9%F6+%B5%F0%C0%DA%C0%CE+%7C+%B3%D7%C0%CC%B9%F6+%BD%BA%C4%F9%BE%EE+%BE%C6%C0%CC%B5%A7%C6%BC%C6%BC&source_title=%B3%D7%C0%CC%B9%F6+%B5%F0%C0%DA%C0%CE+%7C+%B3%D7%C0%CC%B9%F6+%BD%BA%C4%F9%BE%EE+%BE%C6%C0%CC%B5%A7%C6%BC%C6%BC&source_url=" + _url + "&source_contents=" + _contents
				};
					break;
				case "cf":
		            o = {
		                method:"popup",
		                url:"http://cafe.naver.com/CafeScrapView.nhn?source_type=120&title=%B3%D7%C0%CC%B9%F6+%B5%F0%C0%DA%C0%CE+%7C+%B3%D7%C0%CC%B9%F6+%BD%BA%C4%F9%BE%EE+%BE%C6%C0%CC%B5%A7%C6%BC%C6%BC&source_title=%B3%D7%C0%CC%B9%F6+%B5%F0%C0%DA%C0%CE+%7C+%B3%D7%C0%CC%B9%F6+%BD%BA%C4%F9%BE%EE+%BE%C6%C0%CC%B5%A7%C6%BC%C6%BC&source_url=" + _url
		            };
					break;
				default:
					return false;
			}

			 
		    switch(o.method) {
		        case "popup":
		            window.open(o.url);
		            break;
		        default:
		        	return false;
		    }
			
		}
			