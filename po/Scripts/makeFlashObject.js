// JavaScript Document
function makeFlashObject(swfURL,w,h,id,flashVars){
	var swfHTML = ('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="'+ w +'" height="'+h+'" id="'+id+'" align="middle">');
	swfHTML+=('<param name="allowScriptAccess" value="sameDomain" />');
	swfHTML+=('<param name="FlashVars" value="'+ flashVars +'"/>');
	swfHTML+=('<param name="menu" value="false"/>');
	swfHTML+=('<param name="movie" value="'+swfURL+'" /><param name="quality" value="high" /><param name="salign" value="lt" />');
	swfHTML+=('<embed menu="false" src="'+ swfURL +'"  quality="high" FlashVars="'+flashVars+'" bgcolor="#ffffff" width="'+w+'" height="'+h+'" name="'+id+'" align="middle" salign="lt" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />');
	swfHTML+=('</object>');
	document.write(swfHTML);
}