// JavaScript Document

$(document).ready(function(){

	$('.submenu-deploy').click(function(){
		$(this).parent().find('.nav-item-submenu').toggle(100);
		$(this).find('em').toggleClass('dropdown-nav');
		return false;
	});

	$('.style-changer').click(function(){
		return false;
	});

	$('.close-nav, .sidebar-close').click(function(){
		snapper.close();
		console.log("close")
	});

	$('.wide-image').click(function(){
		$(this).parent().find('.wide-item-content').toggle(50);
		return false;
	});

	var snapper = new Snap({
	  element: document.getElementById('content')
	});

	$('.deploy-sidebar').click(function(){
		//$(this).toggleClass('remove-sidebar');
		if( snapper.state().state=="left" ){
			snapper.close();
			console.log("close")
		} else {
			snapper.open('left');
			console.log("open")
		}
		return false;
	});

	$("#content.page-content").css("min-height", $(window).height() + "px")
});