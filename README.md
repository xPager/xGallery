xGallery
=======

Responsive Image Gallery with many settings. [xPager]

HTML
----

``` html
<div id="gallery" class="xpager-gallery">
	<div><img src="photos/1_thumb.JPG" alt="test" data-img="photos/1.JPG" /></div>
	<div><img src="photos/2_thumb.JPG"  alt="Italien" data-img="photos/2.JPG" /></div>
	<div><img src="photos/3_thumb.JPG"  alt="Test 2" data-img="photos/3.JPG" /></div>
	<div><img src="photos/4_thumb.JPG"  alt="Test 1" data-img="photos/4.JPG" /></div>
</div>
```

Script
----
``` js
$("#gallery").xGallery();
```
Settings
----
``` js
$("#gallery").xGallery({
	animationType:"fade",
	animationSpeed:300,
	touchControl:true,
	keyControl:true,
	showPageNum:true		// Page Nummbers
	showPagePoints:true,	// Show Points Nav
	showPageImages:"all",	// all or Num images of Page
	showImages:"all",		// all or Num images show
	showComments:false,		// Show Imagecomments
	showImageNum:true,		// Show Imagenummber
	border:110,
	beta:true
});
```

[xPager]:http://xpager.ch
