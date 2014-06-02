/*#####################################################################################################################
                                                                                                              
                    PPPPPPPPPPPPPPPPP                                                                              
                    P::::::::::::::::P                                                                             
                    P::::::PPPPPP:::::P                                                                            
                    PP:::::P     P:::::P                                                                           
xxxxxxx      xxxxxxx  P::::P     P:::::Paaaaaaaaaaaaa     ggggggggg   ggggg    eeeeeeeeeeee    rrrrr   rrrrrrrrr   
 x:::::x    x:::::x   P::::P     P:::::Pa::::::::::::a   g:::::::::ggg::::g  ee::::::::::::ee  r::::rrr:::::::::r  
  x:::::x  x:::::x    P::::PPPPPP:::::P aaaaaaaaa:::::a g:::::::::::::::::g e::::::eeeee:::::eer:::::::::::::::::r 
   x:::::xx:::::x     P:::::::::::::PP           a::::ag::::::ggggg::::::gge::::::e     e:::::err::::::rrrrr::::::r
    x::::::::::x      P::::PPPPPPPPP      aaaaaaa:::::ag:::::g     g:::::g e:::::::eeeee::::::e r:::::r     r:::::r
     x::::::::x       P::::P            aa::::::::::::ag:::::g     g:::::g e:::::::::::::::::e  r:::::r     rrrrrrr
     x::::::::x       P::::P           a::::aaaa::::::ag:::::g     g:::::g e::::::eeeeeeeeeee   r:::::r            
    x::::::::::x      P::::P          a::::a    a:::::ag::::::g    g:::::g e:::::::e            r:::::r            
   x:::::xx:::::x   PP::::::PP        a::::a    a:::::ag:::::::ggggg:::::g e::::::::e           r:::::r            
  x:::::x  x:::::x  P::::::::P        a:::::aaaa::::::a g::::::::::::::::g  e::::::::eeeeeeee   r:::::r            
 x:::::x    x:::::x P::::::::P         a::::::::::aa:::a gg::::::::::::::g   ee:::::::::::::e   r:::::r            
xxxxxxx      xxxxxxxPPPPPPPPPP          aaaaaaaaaa  aaaa   gggggggg::::::g     eeeeeeeeeeeeee   rrrrrrr            
                                                                   g:::::g                                         
                                                       gggggg      g:::::g                                         
                                                       g:::::gg   gg:::::g                                         
                                                        g::::::ggg:::::::g                                         
                                                         gg:::::::::::::g                                          
                                                           ggg::::::ggg                                            
                                                              gggggg
															  
© xPager - xGallery - Manuel Kleinert - www.xpager.ch - info(at)xpager.ch - v 0.0.1 - 28.05.2014
#####################################################################################################################*/

(function($){
	$.fn.xGallery = function(options){
		if(!options){var options = {};}
		return this.each(function() {
			options.obj = this;
			new xGallery(options);
		});
	}
}(jQuery));

var xGallery = function(options,fx){
	this.options = $.extend({
        id:false,
        obj:false,
        animationType:"fade",
        animationSpeed:500,
        border:200,
        beta:true
    },options);

	// Options to Attributs
	for(var name in this.options){eval("this."+name+"=this.options."+name);}

    // Attreibute
    this.count = 0;
    this.activImage = 0;
    this.images = new Array();
    this.imagesThumb = new Array();
    this.imageNum = 0;
    this.width = $(window).width();
    this.height = $(window).height();
    this.imgContainer = false;
    this.openStatus = true;
    
    this.init();
}

xGallery.prototype = {
    init:function(){
        var self = this;
       
        // Set Obj
        if(this.options.obj){
            this.obj =  this.options.obj;	
        }else{
            this.obj =  $(this.options.id);	
        }
        
        this.imagesThumb = $(this.obj).find("img");
        this.imageNum = $(this.imagesThumb).length;
        
        // Remove
        $(this.imagesThumb).remove();
        
        // Set Images (a Tag Href load)
        $(this.imagesThumb).each(function(i,obj) {
            var img = new Image();
            img.src = $(obj).attr("data-img");
            self.images.push(img);
        });
        
        this.loadGallery();
    },
    
    loadGallery:function(){
        var self = this;
        var num = 0;
        $(this.imagesThumb).each(function(i,obj){
            self.imageLoader(obj,function(){
				num++;
				if(num==self.imageNum){self.build();}
			},function(){
				self.message("Error load image "+(i+1));
				$(obj).remove();
				self.imagesThumb--;
                self.images--;
				if(num==self.imageNum){self.build();}
			});
        });
    }, 
    
    build:function(){
        var self = this;
        
        // Thumbnails
        var thumb = "";
        $(this.imagesThumb).each(function(i,obj) {
            thumb += "<div class='img-container'>";
            thumb += "<img class='thumbnail' src='"+obj['src']+"' />";
            thumb += "</div>";
        });
        
        // Full
        var html = "<div class='inner-content'>";
        $(this.images).each(function(i,obj) {
            if(obj){
                var setClass = "";				
                if(self.scale){
                    if(obj["image"].width < obj["image"].height && self.verticalFormat){
                        setClass += " verticalFormat";
                    }else{
                        setClass += " horizontalFormat";
                    }
                }else{
                    setClass += " noScaleFormat";
                }
                if(self.detectBrightness){
                    setClass += " "+obj["brightness"];
                }
                if(self.shadowBox){setClass += " shadowBox";}
                html += "<div class='image-content'><div class='image "+setClass+"' style='";
                html += "width:"+(self.width-self.border)+"px;";
                html += "height:"+(self.height-self.border)+"px;";
                html += "background-image:url("+obj.src+");";
                html += "'>&nbsp;</div>";
                if(self.showComments && typeof obj["comment"] != 'undefined' && obj["comment"] != ''){
                    html += "<div class='comments'><div class='comments-content'>"+obj["comment"]+"</div>";
                }
                html += "</div>";
            }
        });
		html += "</div>";
        
        html += "<div class='next_btn'>>></div>";
        html += "<div class='prev_btn'><<</div>";
        
        $(this.obj).append("<div class='content'>"+thumb+"</div>");
        $(this.obj).append("<div class='surface'></div>");
        $(this.obj).append("<div class='overflow' style='width:"+(self.width-self.border)+"px;height:"+(self.height-self.border)+"px;'>"+html+"</div>");
        
        this.imagesThumb = $(this.obj).find(".thumbnail");
        this.imgContainer = $(this.obj).find(".image-content");

        this.startGallery();
    },
    
    startGallery:function(){
        var self = this;
        
        $(window).resize(function(){
            self.setSize();    
        });
        
        $(this.imagesThumb).click(function(){
            self.activImage = $(this).parent().index();
            self.openGallery();
        });
        
        $(this.obj).find(".surface").click(function(){
            self.closeGallery(); 
        });
        
        $(this.obj).find(".next_btn").click(function(){
            self.nextImage();
        });
        
        $(this.obj).find(".prev_btn").click(function(){
            self.prevImage();
        });
        
        $(this.imagesThumb).fadeIn(500);
    },
    
    openGallery:function(){
        var self = this;
        if(this.openStatus){
            this.openStatus = false;
            $(this.imgContainer).hide();
            $(this.imgContainer).eq(this.activImage).addClass("activ").css("display","block");
            $(this.obj).find(".surface").fadeIn(500,function(){
                $(self.obj).find(".overflow").fadeIn(500,function(){
                    self.openStatus = true; 
                }); 
            });
        }
    },
    
    closeGallery:function(){
        var self = this;
        if(this.openStatus){
            this.openStatus = false;
            $(this.obj).find(".overflow").fadeOut(300,function(){
                $(self.obj).find(".surface").fadeOut(300,function(){
                    self.openStatus = true;     
                }); 
            });
        }
    },
    
    animation:function(){
       switch(this.animationType){
            case "fade":
                $(this.imgContainer).fadeOut(this.animationSpeed,function(){
                    $(this).removeClass("activ");   
                });
                $(this.imgContainer).eq(this.activImage).fadeIn(this.animationSpeed,function(){
                    $(this).addClass("activ");    
                });
            break;
            default:
               this.message("no Animation Type")
       }
    },
    
    nextImage:function(){
        if(this.activImage < this.imageNum-1){
           this.activImage++;    
        }else{
           this.activImage=0;
        }
        this.animation();
    },
    
    prevImage:function(){
        if(this.activImage > 0){
           this.activImage--;
        }else{
           this.activImage=this.imageNum-1;
        }
        this.animation(); 
    },
    
    imageLoader:function(img,fx,fxErr){
		if(img.complete||img.readyState===4){
			img.src+="?d="+new Date().getTime();
			$(img).load(function(response,status,xhr){
                if(fx){fx();}}).error(function(){if(fxErr){fxErr();}
            });
		}else{
			if(fx){fx();}
		}
	},
    
    setSize:function(){
		var self = this;
		var innerContent = $(this.obj).find(".overflow .inner-content");
		this.width = $(window).width();
        this.height = $(window).height();
        $(this.obj).find(".overflow .image-content .image, .overflow").css({"width":this.width-this.border,"height":this.height-this.border});
	},
    
    // Console
	message:function(txt){
		if(this.beta){
			if($("#cis_error_message").length){
				var html = "<div class='cis_error_message' style='font-size:10px; text-align:left; line-height: 25px; border-bottom:solid 1px #ddd; padding-left:5px;'><div>";
				$("#cis_error_message_titel").after(html);
				$(".cis_error_message").first().text("- "+txt);
			}else{
				var html = "<div id='cis_error_message' style='position:absolute; top:10px; left:10px; z-index:100000; height:100px; width:250px; border:solid 2px #000; display:none;background-color:#fff; overflow: auto;'>";
				html += "<h3 id='cis_error_message_titel' style='display:block; text-align:center; background-color:#666; color:#fff; font-size:12px; line-height: 25px!important; margin:0px;'>Console</h3>";
				html += "<div class='cis_error_message' style='font-size:10px; text-align:left; line-height: 25px; border-bottom:solid 1px #ddd; padding-left:5px;'><div>";
				html += "</div>";			
				$(this.obj).append(html);
				$(".cis_error_message").text("- "+txt);
				$("#cis_error_message").fadeIn(500);
			}
		}
	}
}