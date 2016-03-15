function init(){initVariables(),bindEvents(),main()}function initVariables(){webSocket=new WebSocket(wsUrl),$overlayDeviceManager=$("#overlay-device-manager"),$overlayLogin=$("#login-form"),$body=$(".body"),$loginBtn=$body.find(".login-button"),$authDeviceView=$body.find(".split-table-view.view-left"),$searchedDeviceView=$body.find(".split-table-view.view-right"),$searchedDeviceTable=$searchedDeviceView.find("table.device-table"),$searchedDeviceTableBody=$searchedDeviceTable.find("tbody"),$searchedLastSyncTime=$searchedDeviceView.find("span.sync-time"),$authDeviceTable=$authDeviceView.find("table.device-table"),$searchedDeviceTable=$searchedDeviceView.find("table.device-table"),$authDeviceTableBody=$authDeviceTable.find("tbody"),$authLastSyncTime=$authDeviceView.find("span.sync-time")}function bindEvents(){webSocket.onmessage=receivedMessageFromServer,WebSocket.onerror=webSocketError,WebSocket.onclose=webSocketClosed,$authDeviceTableBody.on("click","span.action.remove",removeItemClicked),$searchedDeviceTableBody.on("click","span.action.add",addItemClicked),$loginBtn.hasClass("log-in")?$loginBtn.on("click",loginBtnClicked):$loginBtn.on("click",logOut)}function logOut(){window.location.href="index.php?logout=true"}function loginBtnClicked(e){$overlayLogin.addClass("show"),$body.addClass("blurry"),$overlayLogin.find("input").focus(),$overlayLogin.one("click",".close",function(){$body.removeClass("blurry"),$overlayLogin.removeClass("show")})}function main(){requestInitialData()}function removeItemClicked(e){var a=$(this),t=a.closest("tr"),i=parseInt(t.attr("data-index"));addOverlay("remove",authDeviceData[i])}function addItemClicked(e){var a=$(this),t=a.closest("tr"),i=parseInt(t.attr("data-index"));addOverlay("add",searchedDeviceData[i])}function addOverlay(e,a){$overlayDeviceManager.addClass("show"),$body.addClass("blurry"),$overlayDeviceManager.find(".headline").text(overlayData[e].headline),$overlayDeviceManager.find(".action").text(overlayData[e].action),$overlayDeviceManager.find(".name").text(a.name),$overlayDeviceManager.find(".address").text(a.address),$overlayDeviceManager.find(".target-list").text(overlayData[e].target),$overlayDeviceManager.one("click",".close, .button.cancel",overlayCloseClicked),$overlayDeviceManager.one("click",".button.accept",function(){applyData(e,a)})}function applyData(e,a){a.type=e,$.ajax({type:"POST",url:removeJsonUrl,data:a,success:function(e){e.success?overlayCloseClicked():console.log("ERROR: ",e.error)},dataType:"json"})}function overlayCloseClicked(){$overlayDeviceManager.removeClass("show"),$body.removeClass("blurry")}function requestInitialData(){getAuthJsonData(),getSearchedJsonData()}function getAuthJsonData(){$.getJSON(getAuthJsonUrl,updateAuthDevices)}function getSearchedJsonData(e){$.getJSON(getSearchJsonUrl,updateSearchedDevices)}function updateTableData(e,a,t,i){var n=new Date;a.empty(),t.text(getFormattedTimeString(n));for(var o=0;o<e.length;o++){var c=e[o],r=new Date(c.time),d=$("<tr></tr>").attr("data-index",o),s=$("<td></td>"),l=s.clone().addClass("name").text(c.name),v=s.clone().addClass("address").text(c.address),u=s.clone().addClass("status"),h=s.clone().addClass("time"),D=s.clone().addClass("actions");u.text("0"===c.status?"Not Available":"1"===c.status?"Available":"Unknown: "+c.status);var g=$("<span></span>").addClass("action").addClass(i["class"]).text(i.label);D.append(g),h.text(getFormattedTimeString(r)),d.append(l).append(v).append(u).append(h).append(D),a.append(d)}}function getFormattedTimeString(e){var a=e.getHours()<10?"0"+e.getHours():e.getHours(),t=e.getMinutes()<10?"0"+e.getMinutes():e.getMinutes(),i=e.getSeconds()<10?"0"+e.getSeconds():e.getSeconds();return a+":"+t+":"+i}function updateSearchedDevices(e){searchedDeviceData=e,updateTableData(searchedDeviceData,$searchedDeviceTableBody,$searchedLastSyncTime,searchedActions)}function updateAuthDevices(e){authDeviceData=e,updateTableData(authDeviceData,$authDeviceTableBody,$authLastSyncTime,authActions)}function webSocketError(e){console.error(e)}function webSocketClosed(e){console.log(e)}function receivedMessageFromServer(e){var a=JSON.parse(e.data);switch(a.type){case"auth-devices":updateAuthDevices(a);break;case"searched-devices":updateSearchedDevices(a);break;default:console.log("WebSocket: Unknown Data Type Received:",a)}}function error(e){console.error(e)}var requiredScripts=["jquery/jquery-2.1.4.min"],webSocket,wsUrl="ws://knock-knock-pi.local:8081",getAuthJsonUrl="files/php/get-available-device-data.php",getSearchJsonUrl="files/php/get-searched-device-data.php",removeJsonUrl="files/php/remove-auth-device-data.php",authDeviceData={},searchedDeviceData={},authLastSyncTime=Date.now(),searchedActions={label:"Add","class":"add"},authActions={label:"Remove","class":"remove"},overlayData={remove:{headline:"Remove Device !?",action:"remove",target:"authentificated"},add:{headline:"Add Device !?",action:"add",target:"authentificated"}},$overlayDeviceManager,$overlayLogin,$body,$loginBtn,$authDeviceView,$searchedDeviceView,$searchedLastSyncTime,$authDeviceTable,$searchedDeviceTable,$authDeviceTableBody,$authLastSyncTime;require(requiredScripts,init,error);