kinopoisk.KpSearchQuery=false;
kinopoisk.KpSelection=false;
kinopoisk.Host="http://www.kinopoisk.ru";
kinopoisk.setTitle = 	function(s)		{
                                            var adds='default';
                                            if(kinopoisk.KpSearchQuery) adds='orange';
                                            if(document.getElementById('kp-button'))
                                                document.getElementById('kp-button').className="kp-button-"+adds;
                                            if(document.getElementById('kp-button-t'))
                                                document.getElementById('kp-button-t').className="kp-button-"+adds;
                                            if(document.getElementById('kp-button-status'))
                                                document.getElementById('kp-button-status').className="kp-button-"+adds;

                                            if(document.getElementById('kp-button')){
                                                document.getElementById('kp-button').label=s; 
                                                document.getElementById('kp-button').setAttribute("tooltiptext",s); 
                                            }  
                                            if(document.getElementById('kp-button-t')){
                                                document.getElementById('kp-button-t').label=s; 
                                                document.getElementById('kp-button-t').setAttribute("tooltiptext",s); 
                                            }
                                            if(document.getElementById('kp-button-status')){
                                                document.getElementById('kp-button-status').label=s; 
                                                document.getElementById('kp-button-status').setAttribute("tooltiptext",s); 
                                            }
                                            if(document.getElementById('kp-context'))
                                                document.getElementById('kp-context').label=s; 
                                            
                                        }
kinopoisk.setOpen = 	function(title) { kinopoisk.setTitle("" + title + "") }
kinopoisk.setSearch =   function(what)  { 
                                                kinopoisk.setTitle("Искать \"" + what + "\" на КиноПоиске");
                                            }
                                        
kinopoisk.setSearching = 	function(what)  { 
                                            kinopoisk.setTitle("Ищем \"" + what + "\"... ");
                                            if(document.getElementById('kp-button'))
                                                document.getElementById('kp-button').className="kp-button-loading";
                                            if(document.getElementById('kp-button-t'))
                                                document.getElementById('kp-button-t').className="kp-button-loading";
                                            if(document.getElementById('kp-button-status'))
                                                document.getElementById('kp-button-status').className="kp-button-loading";
                                        }
                                        
kinopoisk.trim = 		function(s)		{ return s.replace(/^\s+|\s+$/g, "") } 
kinopoisk.setEmpty = 	function()		{ 
                                            if(document.getElementById('kp-button'))
                                                document.getElementById('kp-button').className="kp-button-default";
                                            if(document.getElementById('kp-button-t'))
                                                document.getElementById('kp-button-t').className="kp-button-default";
                                            if(document.getElementById('kp-button-status'))
                                                document.getElementById('kp-button-status').className="kp-button-default";
                                            
                                            kinopoisk.KpSearchQuery='';
                                            kinopoisk.setTitle("КиноПоиск.Ru") 
                                        }

kinopoisk.SelectDetected = function(event) {
    kinopoisk.KpSelection=kinopoisk.trim(content.document.getSelection());
    if(  kinopoisk.KpSelection!=kinopoisk.KpSearchQuery ){
        kinopoisk.setEmpty();
    }
    
    if(kinopoisk.settings.view_mode=='Context' && kinopoisk.settings.search_type=='click')
    {
        if(kinopoisk.KpSelection){
            kinopoisk.setSearch(kinopoisk.KpSelection);
            document.getElementById('kp-context').setAttribute("hidden","false");
        } else {
            document.getElementById('kp-context').setAttribute("hidden","true");
        }
        return ;
    }
    
    if(kinopoisk.settings.search_type=='select')
    {
        kinopoisk.makeSearch();
    } else {
        if(kinopoisk.KpSelection) 
        {
            kinopoisk.setSearch(kinopoisk.KpSelection);
        } else {
            kinopoisk.setEmpty();
        }
    }
}



kinopoisk.makeSearch = function() {
           	 if (!kinopoisk.KpSelection || kinopoisk.KpSelection == "" || kinopoisk.KpSelection.split(" ").length>6 || kinopoisk.KpSelection.length>60) {
                    what = ""
                    kinopoisk.KpSelection="";
                    kinopoisk.setEmpty()
                    return
                }
				if (kinopoisk.KpSelection == kinopoisk.KpSearchQuery) {
                    return
                }
                kinopoisk.KpSearchQuery="";
                what = kinopoisk.KpSelection;
            	kinopoisk.setSearching(what) 
            	var req = new XMLHttpRequest()
                req.open("GET", kinopoisk.Host+"/search/chrometoolbar.php?v=1&query=" + encodeURIComponent(what), true)
                req.onreadystatechange = function() {
                    if (req.readyState == 4) {
                        var data=window.JSON.parse(req.responseText);
						if(data.error || (!data.rus && !data.name)) { kinopoisk.setEmpty(); return; }
                        kinopoisk.KpSearchQuery=what;
						var title='';
						if(data.rus) title=data.rus;
						if(data.name||data.year>0) title+=" (";
						if(data.name) title=title?title+data.name:data.name;
						if(data.name&&data.year&&data.year>0)  title+=", ";
						if(data.year&&data.year>0) title+=data.year;
						if(data.name||data.year>0) title+=")";
						
						if(data.type=='film')
						{
                            data.rating=((data.rating).replace(',','.'));
                            if(data.rating!="0.0") 
								title=title+' - '+data.rating;
						}
						kinopoisk.setOpen(title);
                    }
                }
                req.send(null)
}




kinopoisk.onToolbarButtonCommand= function(){
	var url='';
	if(kinopoisk.KpSearchQuery){
        url=kinopoisk.Host+'/search/chrometoolbar.php?query=' + encodeURIComponent(kinopoisk.KpSearchQuery) +'&go=1'; 
    } else {
        if(kinopoisk.KpSelection && kinopoisk.settings.search_type=='click')
        {   
            kinopoisk.makeSearch();
            return;
        }
        url=kinopoisk.Host;
    }
	aRespectLoadTabPref=1;
	gBrowser.loadOneTab(url, null, null, null, false);
}

kinopoisk.onMenuButtonCommand=function(){
    
	if(kinopoisk.KpSelection && kinopoisk.settings.search_type=='click'){
        url=kinopoisk.Host+'/index.php?first=no&kp_query=' + encodeURIComponent(kinopoisk.KpSelection) +'';
        aRespectLoadTabPref=1;
        gBrowser.loadOneTab(url, null, null, null, false);
    } else {
        kinopoisk.onToolbarButtonCommand();
    }
    
}

kinopoisk.test= function(){
	alert(1);
}

kinopoisk.onToolbarSettingsButtonCommand=function(){
	window.openDialog('chrome://kinopoisk/content/settings.xul', 'KPSettings','chrome,all,dialog=yes,width=400,height=220,top='+((window.innerHeight-220)/2)+',left='+((window.innerWidth-400)/2)+''); 
}
 
kinopoisk.initKinopoisk=function(){
        kinopoisk.prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService)
                .getBranch("kinopoisk.");
                
        kinopoisk.prefManager.QueryInterface(Components.interfaces.nsIPrefBranch2);
        kinopoisk.prefManager.addObserver("",kinopoisk,false);
        kinopoisk.settings={"view_mode":"Toolbox","search_type":"click"};
        kinopoisk.settings.view_mode = kinopoisk.prefManager.getCharPref("view_mode",false);
        kinopoisk.settings.search_type = kinopoisk.prefManager.getCharPref("search_type",false);
        
        if(document.getElementById('kp-toolbar-item'))
            document.getElementById('kp-toolbar-item').setAttribute("hidden","true");
            document.getElementById('kinopoisk-toolbar').setAttribute("hidden","true");
            document.getElementById('kp-context').setAttribute("hidden","true");
            document.getElementById('kp-statusbarpanel').setAttribute("hidden","true");
        
        
        if(kinopoisk.settings.view_mode=='Toolbox') {
            document.getElementById('kinopoisk-toolbar').setAttribute("hidden","false");
            if(document.getElementById('kp-toolbar-item'))
                document.getElementById('kp-toolbar-item').setAttribute("hidden","false");
            }
        if(kinopoisk.settings.view_mode=='Context') 
            document.getElementById('kp-context').setAttribute("hidden","false");
        
        if(kinopoisk.settings.view_mode=='Status') 
            document.getElementById('kp-statusbarpanel').setAttribute("hidden","false");
    }

kinopoisk.observe = function(subject, topic, data)
    {
        if (topic == "nsPref:changed")
        {
            kinopoisk.initKinopoisk();
            return;
        }
    }

kinopoisk.onFirefoxLoad = function(event) {
    kinopoisk.setEmpty();
    kinopoisk.initKinopoisk();
    window.addEventListener("mouseup", kinopoisk.SelectDetected, false);
};

window.addEventListener("load", kinopoisk.onFirefoxLoad, false);
